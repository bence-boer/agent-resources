import { describe, expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { AgentInfo, CommandRunInput, On } from 'claude-code'

const MINUTE = 60 * 1000
const OVER_THRESHOLD = 250_000
const AT_THRESHOLD = 200_000

const SESSION_START = { cwd: '/repository', surface: 'terminal', isInteractive: true } as const
const TURN_START = { text: 'hello', turnId: 'turn-1' } as const
const TURN_COMPLETE = { answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' } as const
const BACKGROUND_AGENT: AgentInfo = { id: 'agent-1', description: 'research', type: 'general-purpose', status: 'running' }

type World = { contextTokens: number; agents: readonly AgentInfo[] }

const simulateEngine = (on: On, world: World) => {
  const compactions: CommandRunInput[] = []
  const logs: string[] = []
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens: world.contextTokens, window: 1_000_000 }, rateLimits: [] },
  }))
  on('agent.list', () => ({ value: [...world.agents] }))
  on('command.run', { command: 'compact' }, ($, e) => {
    compactions.push(e)
    return {}
  })
  on('ui.log', ($, e) => {
    logs.push(e.text)
    return { value: undefined }
  })
  return { compactions, logs, clock: mock.clock(on) }
}

const runOneTurn = async ($: Engine) => {
  await $.turn.start(TURN_START)
  await $.turn.complete(TURN_COMPLETE)
}

describe('idle-compact', () => {
  test('compacts once after 20 idle minutes over 200k tokens', async ($, on) => {
    const { compactions, logs, clock } = simulateEngine(on, { contextTokens: OVER_THRESHOLD, agents: [] })
    await $.session.start(SESSION_START)
    await runOneTurn($)

    await clock.advance(19 * MINUTE)
    expect(compactions).toHaveLength(0)
    await clock.advance(2 * MINUTE)
    expect(compactions).toHaveLength(1)
    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(1)
    expect(logs).toEqual([])
  })

  test('compacts again only after a new turn and another idle stretch', async ($, on) => {
    const { compactions, clock } = simulateEngine(on, { contextTokens: OVER_THRESHOLD, agents: [] })
    await $.session.start(SESSION_START)

    await clock.advance(21 * MINUTE)
    await runOneTurn($)
    await clock.advance(21 * MINUTE)
    expect(compactions).toHaveLength(2)
  })

  test('leaves a context at or under 200k tokens alone', async ($, on) => {
    const { compactions, clock } = simulateEngine(on, { contextTokens: AT_THRESHOLD, agents: [] })
    await $.session.start(SESSION_START)

    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(0)
  })

  test('never compacts while a turn is open, such as one waiting on AskUserQuestion', async ($, on) => {
    const { compactions, clock } = simulateEngine(on, { contextTokens: OVER_THRESHOLD, agents: [] })
    await $.session.start(SESSION_START)
    await $.turn.start(TURN_START)

    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(0)
    await $.turn.complete(TURN_COMPLETE)
    await clock.advance(21 * MINUTE)
    expect(compactions).toHaveLength(1)
  })

  test('counts a working background agent as activity', async ($, on) => {
    const world: World = { contextTokens: OVER_THRESHOLD, agents: [BACKGROUND_AGENT] }
    const { compactions, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)

    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(0)
    world.agents = [{ ...BACKGROUND_AGENT, status: 'completed' }]
    await clock.advance(19 * MINUTE)
    expect(compactions).toHaveLength(0)
    await clock.advance(2 * MINUTE)
    expect(compactions).toHaveLength(1)
  })
})
