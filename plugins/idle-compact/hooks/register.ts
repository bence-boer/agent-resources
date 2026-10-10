import { atom, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { INITIAL_ACTIVITY, POLICY, cacheLifetimeMilliseconds, claimedEffect, transition, warningFor } from './activity'
import type { ActivityEvent, Effect, Observation } from './activity'

const activity = atom({ plugin: 'idle-compact', key: 'activity' } as const, INITIAL_ACTIVITY)

const KEEP_ALIVE_PROMPT = 'This is an automated prompt-cache keep-alive, not a task: call no tools and reply with the single word OK.'

const RESUME_PROMPT =
  'The usage limit has reset. Continue the task you were on when the limit stopped you or idle-compact asked you to wrap up, starting from your handoff note if you wrote one.'

const warningText = (resetsAt: number | undefined): string =>
  [
    `idle-compact: plan usage is above ${POLICY.limitWarningPercent}%`,
    resetsAt === undefined ? '' : ` and resets at ${new Date(resetsAt).toISOString()}`,
    '. Wrap up now: finish or pause the current step, stop the background agents you started, write what you need to pick the work back up into a short handoff note, then end your turn.',
    ` The session is compacted while the prompt cache is warm, and if the turn has not ended by ${POLICY.limitAbortPercent}% usage it is stopped.`,
    resetsAt === undefined ? '' : ' After the reset you are prompted to continue.',
  ].join('')

const record = ($: EngineInterface, event: ActivityEvent) =>
  update($, activity, current => transition(current, event))

const observe = async ($: EngineInterface): Promise<Observation> => {
  const [now, usage, settings] = await Promise.all([$.clock.now(), $.session.usage(), $.settings.read()])
  return {
    now,
    contextTokens: usage.context.tokens ?? 0,
    rateLimits: usage.rateLimits
      .map(window => ({
        kind: window.kind,
        percentUsed: window.percentUsed,
        ...(window.resetsAt !== undefined && { resetsAt: Date.parse(window.resetsAt) }),
      }))
      .filter(window => window.resetsAt === undefined || window.resetsAt > now),
    cacheLifetimeMilliseconds: cacheLifetimeMilliseconds(settings.promptCacheTtl),
  }
}

const perform = async ($: EngineInterface, effect: Effect) => {
  switch (effect.kind) {
    case 'compact': {
      await $.command.run({ command: 'compact' })
      await record($, { kind: 'compaction-finished', observation: await observe($) })
      return
    }
    case 'keep-alive': {
      const reply = await $.model.fork({ prompt: KEEP_ALIVE_PROMPT })
      const cacheReadTokens = 'usage' in reply ? reply.usage.cache_read_input_tokens : 0
      await record($, { kind: 'kept-alive', at: await $.clock.now(), cacheReadTokens })
      $.ui.log(
        `idle-compact: keep-alive fork read ${cacheReadTokens} tokens from the prompt cache` +
          (reply.isAnswered ? '' : ` (no reply: ${reply.reason})`),
      )
      return
    }
    case 'abort-turn':
      $.ui.log(`idle-compact: stopping the turn above ${POLICY.limitAbortPercent}% plan usage`)
      await $.turn.abort({ turnId: effect.turnId })
      return
    case 'resume':
      $.prompt.submit({ text: RESUME_PROMPT }).catch((error: unknown) => $.ui.log(`idle-compact: ${String(error)}`))
      return
  }
}

const check = async ($: EngineInterface) => {
  const observation = await observe($)
  const effect = claimedEffect(await record($, { kind: 'checked', observation }), observation)
  if (effect !== undefined) await perform($, effect)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    $.clock.every(POLICY.checkIntervalMilliseconds, () => {
      check($).catch((error: unknown) => $.ui.log(`idle-compact: ${String(error)}`))
    })
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await record($, { kind: 'turn-started', turnId: e.turnId, at: await $.clock.now() })
    return next(e)
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) await record($, { kind: 'requested', at: await $.clock.now() })
    return yield* next(e)
  })

  on('classic.PostToolBatch', async ($, e, next) => {
    const result = await next(e)
    const toolUseId = e.tool_calls[0]?.tool_use_id
    if (e.agent_id !== undefined || toolUseId === undefined) return result
    const warning = warningFor(await record($, { kind: 'tool-batch-completed', toolUseId }), toolUseId)
    if (warning === undefined) return result
    return { ...result, additionalContext: [...(result.additionalContext ?? []), warningText(warning.resetsAt)] }
  }).catch(($, e, next) => {
    $.ui.log(`idle-compact: the usage warning failed: ${next.error.message}`)
    return undefined
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) await record($, { kind: 'turn-completed', reason: e.reason, observation: await observe($) })
    return next(e)
  })
}
