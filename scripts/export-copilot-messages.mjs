#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MINIMUM_MESSAGE_LENGTH = 200;
const CANDIDATE_DIRECTORY_NAMES = new Set(['.copilot', '.github']);
const SEARCH_SKIP_DIRECTORY_NAMES = new Set([
  '.bun',
  '.cache',
  '.git',
  '.next',
  '.nuxt',
  '.npm',
  '.parcel-cache',
  '.pnpm-store',
  '.svelte-kit',
  '.turbo',
  '.venv',
  '.yarn',
  '__pycache__',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'target',
  'venv',
]);
const STORE_SCAN_SKIP_DIRECTORY_NAMES = new Set([
  ...SEARCH_SKIP_DIRECTORY_NAMES,
  'ide',
  'logs',
  'pkg',
  'prompts',
  'restart',
  'skills',
]);
const RELEVANT_PATH_TOKENS = ['chat', 'conversation', 'copilot', 'event', 'history', 'session'];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_PREFIX_PATTERN = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}/;

main();

function main() {
  try {
    const start_path = resolve_start_path(process.argv.slice(2));
    const repository_root = resolve_repository_root();
    const messages_directory_path = path.join(repository_root, 'resources', 'messages');

    fs.mkdirSync(messages_directory_path, { recursive: true });

    const candidate_root_paths = find_candidate_root_paths(start_path);
    const data_file_paths = collect_data_file_paths(candidate_root_paths);
    const conversations = collect_conversations(data_file_paths);
    const exportable_conversations = conversations.filter(
      (conversation) => conversation.export_messages.length > 0,
    );
    const existing_exports = read_existing_exports(messages_directory_path);
    const backfill_result = backfill_existing_exports(existing_exports, conversations);
    const creation_result = create_missing_exports(
      messages_directory_path,
      exportable_conversations,
      backfill_result.claimed_conversation_ids,
    );

    print_summary({
      start_path,
      candidate_root_paths,
      data_file_paths,
      conversations,
      exportable_conversations,
      existing_exports,
      backfill_result,
      creation_result,
    });
  } catch (error) {
    console.error(format_error_message(error));
    process.exitCode = 1;
  }
}

function resolve_start_path(arguments_list) {
  if (arguments_list.includes('-h') || arguments_list.includes('--help')) {
    print_usage();
    process.exit(0);
  }

  const provided_path = arguments_list[0] ?? os.homedir();
  const resolved_path = path.resolve(provided_path);

  let directory_stat;

  try {
    directory_stat = fs.statSync(resolved_path);
  } catch (error) {
    throw new Error(`Start path does not exist: ${resolved_path}`, { cause: error });
  }

  if (!directory_stat.isDirectory()) {
    throw new Error(`Start path is not a directory: ${resolved_path}`);
  }

  return resolved_path;
}

function resolve_repository_root() {
  const script_file_path = fs.realpathSync(fileURLToPath(import.meta.url));
  return path.resolve(path.dirname(script_file_path), '..');
}

function print_usage() {
  const script_name = path.basename(fileURLToPath(import.meta.url));

  console.log(`Usage: node scripts/${script_name} [start-path]`);
  console.log('');
  console.log('Searches for Copilot-related dot-folders, backfills conversation ids into');
  console.log('existing markdown exports, and creates markdown files for new conversations.');
  console.log(`The default search root is ${os.homedir()}.`);
}

function find_candidate_root_paths(start_path) {
  const candidate_root_paths = [];
  const directory_paths_to_visit = [start_path];
  const visited_directory_paths = new Set();

  while (directory_paths_to_visit.length > 0) {
    const current_directory_path = directory_paths_to_visit.pop();

    if (visited_directory_paths.has(current_directory_path)) {
      continue;
    }

    visited_directory_paths.add(current_directory_path);

    const current_directory_name = path.basename(current_directory_path);

    if (CANDIDATE_DIRECTORY_NAMES.has(current_directory_name)) {
      if (is_relevant_candidate_root(current_directory_path, current_directory_name)) {
        candidate_root_paths.push(current_directory_path);
      }

      continue;
    }

    if (current_directory_path !== start_path && SEARCH_SKIP_DIRECTORY_NAMES.has(current_directory_name)) {
      continue;
    }

    for (const entry of safe_read_directory_entries(current_directory_path)) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) {
        continue;
      }

      directory_paths_to_visit.push(path.join(current_directory_path, entry.name));
    }
  }

  return candidate_root_paths.sort();
}

function is_relevant_candidate_root(candidate_root_path, candidate_root_name) {
  if (candidate_root_name === '.copilot') {
    return true;
  }

  for (const entry of safe_read_directory_entries(candidate_root_path)) {
    const entry_name = entry.name.toLowerCase();

    if (
      entry_name === '.copilot' ||
      RELEVANT_PATH_TOKENS.some((token) => entry_name.includes(token)) ||
      entry_name.endsWith('.jsonl')
    ) {
      return true;
    }
  }

  return false;
}

function collect_data_file_paths(candidate_root_paths) {
  const data_file_paths = new Set();

  for (const candidate_root_path of candidate_root_paths) {
    const directory_paths_to_visit = [candidate_root_path];

    while (directory_paths_to_visit.length > 0) {
      const current_directory_path = directory_paths_to_visit.pop();
      const current_directory_name = path.basename(current_directory_path);

      if (
        current_directory_path !== candidate_root_path &&
        STORE_SCAN_SKIP_DIRECTORY_NAMES.has(current_directory_name)
      ) {
        continue;
      }

      for (const entry of safe_read_directory_entries(current_directory_path)) {
        const full_entry_path = path.join(current_directory_path, entry.name);

        if (entry.isSymbolicLink()) {
          continue;
        }

        if (entry.isDirectory()) {
          directory_paths_to_visit.push(full_entry_path);
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const lower_case_entry_path = full_entry_path.toLowerCase();

        if (lower_case_entry_path.endsWith('.jsonl')) {
          data_file_paths.add(full_entry_path);
          continue;
        }

        if (lower_case_entry_path.endsWith('.json') && path_looks_conversation_related(full_entry_path)) {
          data_file_paths.add(full_entry_path);
        }
      }
    }
  }

  return [...data_file_paths].sort();
}

function collect_conversations(data_file_paths) {
  const conversations_by_id = new Map();

  for (const data_file_path of data_file_paths) {
    for (const extracted_conversation of extract_conversations_from_file(data_file_path)) {
      const existing_conversation = conversations_by_id.get(extracted_conversation.id);

      if (!existing_conversation) {
        conversations_by_id.set(extracted_conversation.id, extracted_conversation);
        continue;
      }

      merge_conversation(existing_conversation, extracted_conversation);
    }
  }

  return [...conversations_by_id.values()].sort(compare_conversations);
}

function extract_conversations_from_file(file_path) {
  if (file_path.toLowerCase().endsWith('.jsonl')) {
    return extract_conversations_from_json_lines_file(file_path);
  }

  return extract_conversations_from_json_file(file_path);
}

function extract_conversations_from_json_lines_file(file_path) {
  const raw_text = fs.readFileSync(file_path, 'utf8').replace(/^\uFEFF/, '');
  const events = [];

  for (const line of raw_text.split('\n')) {
    const trimmed_line = line.trim();

    if (!trimmed_line) {
      continue;
    }

    let parsed_line;

    try {
      parsed_line = JSON.parse(trimmed_line);
    } catch {
      return [];
    }

    events.push(parsed_line);
  }

  return extract_conversations_from_event_collection(events, file_path);
}

function extract_conversations_from_json_file(file_path) {
  let parsed_json;

  try {
    parsed_json = JSON.parse(fs.readFileSync(file_path, 'utf8'));
  } catch {
    return [];
  }

  const event_collections = [];

  if (Array.isArray(parsed_json)) {
    event_collections.push(parsed_json);
  }

  if (is_plain_object(parsed_json) && Array.isArray(parsed_json.events)) {
    event_collections.push(parsed_json.events);
  }

  const extracted_conversations = [];

  for (const event_collection of event_collections) {
    extracted_conversations.push(...extract_conversations_from_event_collection(event_collection, file_path));
  }

  return extracted_conversations;
}

function extract_conversations_from_event_collection(event_collection, source_path) {
  if (!Array.isArray(event_collection) || !event_collection.some(is_event_like)) {
    return [];
  }

  const session_event_groups = split_event_collection_into_sessions(event_collection);
  const extracted_conversations = [];

  for (const session_events of session_event_groups) {
    const extracted_conversation = extract_conversation_from_session_events(session_events, source_path);

    if (extracted_conversation) {
      extracted_conversations.push(extracted_conversation);
    }
  }

  return extracted_conversations;
}

function split_event_collection_into_sessions(event_collection) {
  const session_event_groups = [];
  let current_session_events = [];

  for (const event of event_collection) {
    if (event?.type === 'session.start' && current_session_events.length > 0) {
      session_event_groups.push(current_session_events);
      current_session_events = [event];
      continue;
    }

    current_session_events.push(event);
  }

  if (current_session_events.length > 0) {
    session_event_groups.push(current_session_events);
  }

  return session_event_groups;
}

function extract_conversation_from_session_events(session_events, source_path) {
  const session_id = find_session_id(session_events, source_path);
  const session_context = find_session_context(session_events);

  if (!session_id) {
    return null;
  }

  const all_user_messages = [];
  const export_messages = [];
  let first_user_message_timestamp = null;
  let first_exported_message_timestamp = null;

  for (const event of session_events) {
    if (event?.type !== 'user.message') {
      continue;
    }

    const message_content = normalize_message_text(extract_message_content(event));

    if (!message_content) {
      continue;
    }

    const message_timestamp = extract_message_timestamp(event);

    if (!message_timestamp) {
      continue;
    }

    if (!first_user_message_timestamp) {
      first_user_message_timestamp = message_timestamp;
    }

    all_user_messages.push(message_content);

    if (message_content.length > MINIMUM_MESSAGE_LENGTH) {
      if (!first_exported_message_timestamp) {
        first_exported_message_timestamp = message_timestamp;
      }

      export_messages.push(message_content);
    }
  }

  if (!first_user_message_timestamp || all_user_messages.length === 0) {
    return null;
  }

  if (is_internal_agent_session(session_context, all_user_messages[0])) {
    return null;
  }

  return {
    id: session_id,
    first_user_message_timestamp,
    first_exported_message_timestamp,
    file_timestamp_prefix: format_timestamp_prefix(first_user_message_timestamp),
    all_user_messages,
    export_messages,
    all_messages_body: build_export_body(all_user_messages),
    export_body: build_export_body(export_messages),
    source_paths: [source_path],
  };
}

function find_session_id(session_events, source_path) {
  for (const event of session_events) {
    if (event?.type === 'session.start' && typeof event?.data?.sessionId === 'string') {
      return event.data.sessionId;
    }
  }

  return infer_session_id_from_path(source_path);
}

function find_session_context(session_events) {
  for (const event of session_events) {
    if (event?.type === 'session.start' && is_plain_object(event?.data?.context)) {
      return event.data.context;
    }
  }

  return {};
}

function infer_session_id_from_path(source_path) {
  const basename_without_extension = path.basename(source_path, path.extname(source_path));

  if (UUID_PATTERN.test(basename_without_extension)) {
    return basename_without_extension;
  }

  const parent_directory_name = path.basename(path.dirname(source_path));

  if (UUID_PATTERN.test(parent_directory_name)) {
    return parent_directory_name;
  }

  return null;
}

function extract_message_content(event) {
  const direct_content = event?.data?.content;

  if (typeof direct_content === 'string' && direct_content.trim() !== '') {
    return direct_content;
  }

  const transformed_content = event?.data?.transformedContent;

  if (typeof transformed_content === 'string' && transformed_content.trim() !== '') {
    return transformed_content.replace(/^<current_datetime>[\s\S]*?<\/current_datetime>\n\n/, '');
  }

  return null;
}

function extract_message_timestamp(event) {
  if (typeof event?.timestamp === 'string' && !Number.isNaN(Date.parse(event.timestamp))) {
    return event.timestamp;
  }

  return null;
}

function normalize_message_text(message_text) {
  if (typeof message_text !== 'string') {
    return null;
  }

  const normalized_text = normalize_text(message_text).trimEnd();
  return normalized_text.length > 0 ? normalized_text : null;
}

function build_export_body(messages) {
  return normalize_export_body(messages.join('\n\n---\n\n'));
}

function normalize_export_body(body_text) {
  const normalized_text = normalize_text(body_text).replace(/^\n+/, '').trimEnd();

  if (!normalized_text) {
    return '';
  }

  return `${normalized_text}\n`;
}

function format_timestamp_prefix(iso_timestamp) {
  const date = new Date(iso_timestamp);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${iso_timestamp}`);
  }

  return [
    date.getFullYear(),
    pad_number(date.getMonth() + 1),
    pad_number(date.getDate()),
  ].join('-') +
    '_' +
    [pad_number(date.getHours()), pad_number(date.getMinutes())].join('-');
}

function read_existing_exports(messages_directory_path) {
  const existing_exports = [];

  for (const entry of safe_read_directory_entries(messages_directory_path)) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const file_path = path.join(messages_directory_path, entry.name);
    const raw_text = normalize_text(fs.readFileSync(file_path, 'utf8'));
    const { frontmatter, body } = split_frontmatter(raw_text);

    existing_exports.push({
      file_path,
      file_name: entry.name,
      id: typeof frontmatter.id === 'string' && frontmatter.id.trim() !== '' ? frontmatter.id.trim() : null,
      timestamp_prefix: extract_timestamp_prefix(entry.name),
      body: normalize_export_body(body),
      raw_body: body,
    });
  }

  return existing_exports.sort((left, right) => left.file_name.localeCompare(right.file_name));
}

function backfill_existing_exports(existing_exports, conversations) {
  const conversations_by_timestamp_prefix = group_items(
    conversations,
    (conversation) => conversation.file_timestamp_prefix,
  );
  const conversations_by_body = build_conversations_by_body(conversations);
  const claimed_conversation_ids = new Set(
    existing_exports.map((existing_export) => existing_export.id).filter(Boolean),
  );
  const updated_exports = [];
  const ambiguous_exports = [];
  const unmatched_exports = [];

  for (const existing_export of existing_exports) {
    if (existing_export.id) {
      continue;
    }

    const matching_conversation = find_matching_conversation(
      existing_export,
      conversations_by_timestamp_prefix,
      conversations_by_body,
      claimed_conversation_ids,
    );

    if (matching_conversation.status === 'matched') {
      write_export_with_frontmatter(existing_export.file_path, existing_export.raw_body, matching_conversation.id);
      existing_export.id = matching_conversation.id;
      claimed_conversation_ids.add(matching_conversation.id);
      updated_exports.push({
        file_name: existing_export.file_name,
        id: matching_conversation.id,
        strategy: matching_conversation.strategy,
      });
      continue;
    }

    if (matching_conversation.status === 'ambiguous') {
      ambiguous_exports.push({
        file_name: existing_export.file_name,
        candidate_ids: matching_conversation.candidate_ids,
      });
      continue;
    }

    unmatched_exports.push(existing_export.file_name);
  }

  return {
    updated_exports,
    ambiguous_exports,
    unmatched_exports,
    claimed_conversation_ids,
  };
}

function find_matching_conversation(
  existing_export,
  conversations_by_timestamp_prefix,
  conversations_by_body,
  claimed_conversation_ids,
) {
  const timestamp_matches = filter_unclaimed_conversations(
    conversations_by_timestamp_prefix.get(existing_export.timestamp_prefix) ?? [],
    claimed_conversation_ids,
  );
  const exact_body_matches = filter_unclaimed_conversations(
    conversations_by_body.get(existing_export.body) ?? [],
    claimed_conversation_ids,
  );
  const exact_timestamp_and_body_matches = timestamp_matches.filter(
    (conversation) => conversation_matches_body(conversation, existing_export.body),
  );

  if (exact_timestamp_and_body_matches.length === 1) {
    return {
      status: 'matched',
      id: exact_timestamp_and_body_matches[0].id,
      strategy: 'timestamp+body',
    };
  }

  if (exact_body_matches.length === 1) {
    return {
      status: 'matched',
      id: exact_body_matches[0].id,
      strategy: 'body',
    };
  }

  if (timestamp_matches.length === 1) {
    return {
      status: 'matched',
      id: timestamp_matches[0].id,
      strategy: 'timestamp',
    };
  }

  const ambiguous_candidates = [
    ...new Set(
      [...exact_timestamp_and_body_matches, ...exact_body_matches, ...timestamp_matches].map(
        (conversation) => conversation.id,
      ),
    ),
  ];

  if (ambiguous_candidates.length > 1) {
    return {
      status: 'ambiguous',
      candidate_ids: ambiguous_candidates.sort(),
    };
  }

  return { status: 'unmatched' };
}

function filter_unclaimed_conversations(conversations, claimed_conversation_ids) {
  return conversations.filter((conversation) => !claimed_conversation_ids.has(conversation.id));
}

function create_missing_exports(messages_directory_path, conversations, claimed_conversation_ids) {
  const created_exports = [];
  const skipped_conversation_ids = [];

  for (const conversation of conversations) {
    if (claimed_conversation_ids.has(conversation.id)) {
      skipped_conversation_ids.push(conversation.id);
      continue;
    }

    const target_file_path = choose_available_export_path(messages_directory_path, conversation);

    fs.writeFileSync(
      target_file_path,
      build_export_file_text(conversation.id, conversation.export_body),
      'utf8',
    );
    claimed_conversation_ids.add(conversation.id);
    created_exports.push(path.basename(target_file_path));
  }

  return {
    created_exports,
    skipped_conversation_ids,
  };
}

function choose_available_export_path(messages_directory_path, conversation) {
  const base_file_name = `${conversation.file_timestamp_prefix}.md`;
  const base_file_path = path.join(messages_directory_path, base_file_name);

  if (!fs.existsSync(base_file_path)) {
    return base_file_path;
  }

  const short_id = conversation.id.slice(0, 8);
  let suffix_counter = 1;

  while (true) {
    const suffix = suffix_counter === 1 ? short_id : `${short_id}-${suffix_counter}`;
    const file_name = `${conversation.file_timestamp_prefix}__${suffix}.md`;
    const file_path = path.join(messages_directory_path, file_name);

    if (!fs.existsSync(file_path)) {
      return file_path;
    }

    suffix_counter += 1;
  }
}

function build_export_file_text(conversation_id, body_text) {
  return `---\nid: ${conversation_id}\n---\n\n${normalize_export_body(body_text)}`;
}

function write_export_with_frontmatter(file_path, raw_body, conversation_id) {
  fs.writeFileSync(file_path, build_export_file_text(conversation_id, raw_body), 'utf8');
}

function split_frontmatter(raw_text) {
  if (!raw_text.startsWith('---\n')) {
    return {
      frontmatter: {},
      body: raw_text,
    };
  }

  const closing_marker_index = raw_text.indexOf('\n---\n', 4);

  if (closing_marker_index === -1) {
    return {
      frontmatter: {},
      body: raw_text,
    };
  }

  const frontmatter_text = raw_text.slice(4, closing_marker_index);
  const body = raw_text.slice(closing_marker_index + 5);

  return {
    frontmatter: parse_simple_yaml(frontmatter_text),
    body,
  };
}

function parse_simple_yaml(frontmatter_text) {
  const parsed_frontmatter = {};

  for (const line of frontmatter_text.split('\n')) {
    const separator_index = line.indexOf(':');

    if (separator_index === -1) {
      continue;
    }

    const key = line.slice(0, separator_index).trim();
    const value = line.slice(separator_index + 1).trim();

    if (key) {
      parsed_frontmatter[key] = value;
    }
  }

  return parsed_frontmatter;
}

function merge_conversation(existing_conversation, incoming_conversation) {
  for (const source_path of incoming_conversation.source_paths) {
    if (!existing_conversation.source_paths.includes(source_path)) {
      existing_conversation.source_paths.push(source_path);
    }
  }

  if (incoming_conversation.all_user_messages.length > existing_conversation.all_user_messages.length) {
    existing_conversation.all_user_messages = incoming_conversation.all_user_messages;
    existing_conversation.all_messages_body = incoming_conversation.all_messages_body;
  }

  if (incoming_conversation.export_messages.length > existing_conversation.export_messages.length) {
    existing_conversation.export_messages = incoming_conversation.export_messages;
    existing_conversation.export_body = incoming_conversation.export_body;
  }

  if (
    Date.parse(incoming_conversation.first_user_message_timestamp) <
    Date.parse(existing_conversation.first_user_message_timestamp)
  ) {
    existing_conversation.first_user_message_timestamp = incoming_conversation.first_user_message_timestamp;
    existing_conversation.file_timestamp_prefix = incoming_conversation.file_timestamp_prefix;
  }

  if (
    incoming_conversation.first_exported_message_timestamp &&
    (!existing_conversation.first_exported_message_timestamp ||
      Date.parse(incoming_conversation.first_exported_message_timestamp) <
        Date.parse(existing_conversation.first_exported_message_timestamp))
  ) {
    existing_conversation.first_exported_message_timestamp =
      incoming_conversation.first_exported_message_timestamp;
  }
}

function compare_conversations(left, right) {
  const timestamp_difference =
    Date.parse(left.first_user_message_timestamp) - Date.parse(right.first_user_message_timestamp);

  if (timestamp_difference !== 0) {
    return timestamp_difference;
  }

  return left.id.localeCompare(right.id);
}

function group_items(items, get_key) {
  const grouped_items = new Map();

  for (const item of items) {
    const key = get_key(item);

    if (!grouped_items.has(key)) {
      grouped_items.set(key, []);
    }

    grouped_items.get(key).push(item);
  }

  return grouped_items;
}

function build_conversations_by_body(conversations) {
  const conversations_by_body = new Map();

  for (const conversation of conversations) {
    for (const body of [conversation.export_body, conversation.all_messages_body]) {
      if (!body) {
        continue;
      }

      if (!conversations_by_body.has(body)) {
        conversations_by_body.set(body, []);
      }

      const matching_conversations = conversations_by_body.get(body);

      if (!matching_conversations.some((existing_conversation) => existing_conversation.id === conversation.id)) {
        matching_conversations.push(conversation);
      }
    }
  }

  return conversations_by_body;
}

function conversation_matches_body(conversation, export_body) {
  return conversation.export_body === export_body || conversation.all_messages_body === export_body;
}

function is_internal_agent_session(session_context, first_user_message) {
  const cwd = typeof session_context?.cwd === 'string' ? session_context.cwd.toLowerCase() : '';
  const normalized_first_message =
    typeof first_user_message === 'string' ? first_user_message.trimStart() : '';

  if (
    cwd.includes('/agents/workspace/') ||
    cwd.includes('/agents/reviews/') ||
    cwd.includes('/agent-workspace/')
  ) {
    return true;
  }

  return (
    normalized_first_message.startsWith('You are a Manager Agent.') ||
    normalized_first_message.startsWith('# Manager Agent Prompt')
  );
}

function extract_timestamp_prefix(file_name) {
  const matched_prefix = file_name.match(TIMESTAMP_PREFIX_PATTERN);
  return matched_prefix ? matched_prefix[0] : null;
}

function path_looks_conversation_related(file_path) {
  const lower_case_path = file_path.toLowerCase();
  return RELEVANT_PATH_TOKENS.some((token) => lower_case_path.includes(token));
}

function is_event_like(value) {
  return is_plain_object(value) && typeof value.type === 'string';
}

function is_plain_object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalize_text(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function safe_read_directory_entries(directory_path) {
  try {
    return fs.readdirSync(directory_path, { withFileTypes: true });
  } catch {
    return [];
  }
}

function pad_number(value) {
  return String(value).padStart(2, '0');
}

function format_error_message(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function print_summary({
  start_path,
  candidate_root_paths,
  data_file_paths,
  conversations,
  exportable_conversations,
  existing_exports,
  backfill_result,
  creation_result,
}) {
  console.log(`Search root: ${start_path}`);
  console.log(`Copilot roots found: ${candidate_root_paths.length}`);
  console.log(`Conversation store files scanned: ${data_file_paths.length}`);
  console.log(`Conversations with user messages: ${conversations.length}`);
  console.log(`Conversations with long user messages: ${exportable_conversations.length}`);
  console.log(`Existing exports inspected: ${existing_exports.length}`);
  console.log(`Existing exports backfilled: ${backfill_result.updated_exports.length}`);
  console.log(`New exports created: ${creation_result.created_exports.length}`);

  if (backfill_result.ambiguous_exports.length > 0) {
    console.log('');
    console.log('Ambiguous existing exports:');

    for (const ambiguous_export of backfill_result.ambiguous_exports) {
      console.log(`- ${ambiguous_export.file_name} -> ${ambiguous_export.candidate_ids.join(', ')}`);
    }
  }

  if (backfill_result.unmatched_exports.length > 0) {
    console.log('');
    console.log('Unmatched existing exports:');

    for (const unmatched_export of backfill_result.unmatched_exports) {
      console.log(`- ${unmatched_export}`);
    }
  }

  if (creation_result.created_exports.length > 0) {
    console.log('');
    console.log('Created files:');

    for (const created_export of creation_result.created_exports) {
      console.log(`- ${created_export}`);
    }
  }
}
