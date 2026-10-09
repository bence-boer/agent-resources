import { atom, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { INITIAL_ACTIVITY, POLICY, isClaimedBy, isWorking, transition } from './activity'
import type { ActivityEvent, Observation } from './activity'

const activity = atom({ plugin: 'idle-compact', key: 'activity' } as const, INITIAL_ACTIVITY)

const record = ($: EngineInterface, event: ActivityEvent) =>
  update($, activity, current => transition(current, event))

const observe = async ($: EngineInterface): Promise<Observation> => {
  const [now, usage, agents] = await Promise.all([$.clock.now(), $.session.usage(), $.agent.list()])
  return { now, contextTokens: usage.context.tokens ?? 0, hasWorkingAgents: agents.some(isWorking) }
}

const compactWhenIdle = async ($: EngineInterface) => {
  const observation = await observe($)
  const checked = await record($, { kind: 'checked', observation })
  if (!isClaimedBy(checked, observation)) return

  await $.command.run({ command: 'compact' })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await record($, { kind: 'session-started', at: await $.clock.now() })
    $.clock.every(POLICY.checkIntervalMilliseconds, () => {
      compactWhenIdle($).catch((error: unknown) => $.ui.log(`idle-compact: ${String(error)}`))
    })
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await record($, { kind: 'turn-started' })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await record($, { kind: 'turn-completed', at: await $.clock.now(), agentId: e.agentId })
    return next(e)
  })
}
