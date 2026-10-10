import { describe, expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On, SessionRateLimit, TurnCompleteReason } from 'claude-code'

type UnrefusedReason = Exclude<TurnCompleteReason, 'refusal'>

const MINUTE = 60 * 1000
const OVER_THRESHOLD = 250_000
const AT_THRESHOLD = 200_000
const RESET_TIME = 4 * 60 * MINUTE
const RESETS_AT = new Date(RESET_TIME).toISOString()
const FIVE_HOUR_WINDOW: SessionRateLimit = { kind: 'five_hour', percentUsed: 40, resetsAt: RESETS_AT }

const SESSION_START = { cwd: '/repository', surface: 'terminal', isInteractive: false } as const
const TURN_ID = 'turn-1'

type World = {
  contextTokens: number
  rateLimits: readonly SessionRateLimit[]
  promptCacheTtl?: '5m' | '1h'
  forkCacheReadTokens: number
}

const simulateEngine = (on: On, world: World) => {
  const compactions: number[] = []
  const forks: number[] = []
  const aborts: string[] = []
  const prompts: string[] = []
  const clock = mock.clock(on)
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('turn.step', async function* ($, e) {
    return { turnId: e.turnId, index: e.index, answer: '', toolUses: [], stopReason: 'tool_use', usage: null }
  })
  on('turn.complete', () => ({ text: '' }))
  on('classic.PostToolBatch', () => ({}))
  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens: world.contextTokens, window: 1_000_000 }, rateLimits: [...world.rateLimits] },
  }))
  on('settings.read', () => ({ value: world.promptCacheTtl === undefined ? {} : { promptCacheTtl: world.promptCacheTtl } }))
  on('command.run', { command: 'compact' }, async () => {
    compactions.push(await clock.now())
    world.contextTokens = 20_000
    return {}
  })
  on('model.fork', async () => {
    forks.push(await clock.now())
    const usage = { input_tokens: 0, output_tokens: 1, cache_read_input_tokens: world.forkCacheReadTokens, cache_creation_input_tokens: 0 }
    return { value: { isAnswered: true, text: 'OK', usage } }
  })
  on('turn.abort', ($, e) => {
    aborts.push(e.turnId)
    return { value: undefined }
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('ui.log', () => ({ value: undefined }))
  return { compactions, forks, aborts, prompts, clock }
}

const startTurn = async ($: Engine) => {
  await $.turn.start({ text: 'hello', turnId: TURN_ID })
  await requestModel($)
}

const requestModel = async ($: Engine) => {
  const stream = $.turn.step({ turnId: TURN_ID, index: 0, model: 'claude-opus-5-5', messageCount: 1 })
  for await (const chunk of stream) void chunk
}

const completeTurn = ($: Engine, reason: UnrefusedReason = 'answer') =>
  $.turn.complete({ answer: '', durationMs: 1, isAborted: reason === 'aborted', turnId: TURN_ID, reason })

const completeToolBatch = ($: Engine, toolUseId: string, agentId?: string) =>
  $.classic.PostToolBatch({
    tool_calls: [{ tool_name: 'Bash', tool_input: {}, tool_use_id: toolUseId }],
    ...(agentId !== undefined && { agent_id: agentId }),
  })

const freshWorld = (overrides: Partial<World> = {}): World => ({
  contextTokens: OVER_THRESHOLD,
  rateLimits: [FIVE_HOUR_WINDOW],
  forkCacheReadTokens: OVER_THRESHOLD,
  ...overrides,
})

describe('idle-compact', () => {
  test('compacts once 55 minutes after the last request on the one-hour cache', async ($, on) => {
    const { compactions, clock } = simulateEngine(on, freshWorld())
    await $.session.start(SESSION_START)
    await startTurn($)
    await completeTurn($)

    await clock.advance(54 * MINUTE)
    expect(compactions).toHaveLength(0)
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)
    await clock.advance(120 * MINUTE)
    expect(compactions).toHaveLength(1)
  })

  test('follows a five-minute cache when promptCacheTtl pins it', async ($, on) => {
    const { compactions, clock } = simulateEngine(on, freshWorld({ promptCacheTtl: '5m' }))
    await $.session.start(SESSION_START)
    await startTurn($)
    await completeTurn($)

    await clock.advance(2 * MINUTE)
    expect(compactions).toHaveLength(0)
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)
  })

  test('leaves a context at or under 200k tokens alone', async ($, on) => {
    const { compactions, forks, clock } = simulateEngine(on, freshWorld({ contextTokens: AT_THRESHOLD }))
    await $.session.start(SESSION_START)
    await startTurn($)
    await clock.advance(120 * MINUTE)
    await completeTurn($)
    await clock.advance(120 * MINUTE)

    expect(forks).toHaveLength(0)
    expect(compactions).toHaveLength(0)
  })

  test('keeps the cache warm through a tool call longer than the cache lifetime, without compacting', async ($, on) => {
    const { compactions, forks, clock } = simulateEngine(on, freshWorld())
    await $.session.start(SESSION_START)
    await startTurn($)

    await clock.advance(54 * MINUTE)
    expect(forks).toHaveLength(0)
    await clock.advance(1 * MINUTE)
    expect(forks).toHaveLength(1)
    await clock.advance(55 * MINUTE)
    expect(forks).toHaveLength(2)
    await completeToolBatch($, 'tool-1')
    await requestModel($)
    await completeTurn($)
    expect(compactions).toHaveLength(0)
  })

  test('stops pinging for the rest of the tool call once a fork finds the cache already gone', async ($, on) => {
    const { forks, clock } = simulateEngine(on, freshWorld({ forkCacheReadTokens: 0 }))
    await $.session.start(SESSION_START)
    await startTurn($)

    await clock.advance(180 * MINUTE)
    expect(forks).toHaveLength(1)
  })

  test('warns the main agent once near the limit, compacts at the turn end and continues after the reset', async ($, on) => {
    const world = freshWorld()
    const { compactions, prompts, aborts, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await startTurn($)

    world.rateLimits = [{ ...FIVE_HOUR_WINDOW, percentUsed: 96 }]
    await clock.advance(1 * MINUTE)
    const subagentBatch = await completeToolBatch($, 'subagent-tool', 'agent-1')
    expect(subagentBatch.additionalContext).toBeUndefined()
    const warned = await completeToolBatch($, 'tool-1')
    expect(warned.additionalContext?.[0]).toContain('Wrap up now')
    expect((await completeToolBatch($, 'tool-2')).additionalContext).toBeUndefined()

    await requestModel($)
    await completeTurn($)
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)
    expect(aborts).toHaveLength(0)

    await clock.advance(RESET_TIME - (await clock.now()))
    expect(prompts).toHaveLength(0)
    await clock.advance(1 * MINUTE)
    expect(prompts).toHaveLength(1)
    await clock.advance(10 * MINUTE)
    expect(prompts).toHaveLength(1)
  })

  test('stops a turn that reaches 98% usage, then compacts it and continues after the reset', async ($, on) => {
    const world = freshWorld()
    const { compactions, prompts, aborts, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await startTurn($)

    world.rateLimits = [{ ...FIVE_HOUR_WINDOW, percentUsed: 98 }]
    await clock.advance(1 * MINUTE)
    expect(aborts).toEqual([TURN_ID])
    await completeTurn($, 'aborted')
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)

    await clock.advance(RESET_TIME + 1 * MINUTE - (await clock.now()))
    expect(prompts).toHaveLength(1)
  })

  test('does not try to compact a turn the limit ended, and continues after the reset', async ($, on) => {
    const world = freshWorld()
    const { compactions, prompts, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await startTurn($)

    world.rateLimits = [{ ...FIVE_HOUR_WINDOW, percentUsed: 100 }]
    await completeTurn($, 'error')
    await clock.advance(RESET_TIME + 1 * MINUTE - (await clock.now()))
    expect(compactions).toHaveLength(0)
    expect(prompts).toHaveLength(1)
  })

  test('does not continue a turn the person interrupted', async ($, on) => {
    const world = freshWorld()
    const { prompts, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await startTurn($)

    world.rateLimits = [{ ...FIVE_HOUR_WINDOW, percentUsed: 96 }]
    await clock.advance(1 * MINUTE)
    await completeToolBatch($, 'tool-1')
    await completeTurn($, 'aborted')
    await clock.advance(4 * 60 * MINUTE)
    expect(prompts).toHaveLength(0)
  })
})
