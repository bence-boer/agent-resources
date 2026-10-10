import { describe, expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { AgentInfo, CommandRunInput, On, SessionRateLimit } from 'claude-code'

const MINUTE = 60 * 1000
const OVER_THRESHOLD = 250_000
const AT_THRESHOLD = 200_000
const FIVE_HOUR_WINDOW: SessionRateLimit = { kind: 'five_hour', percentUsed: 40 }
const SEVEN_DAY_WINDOW: SessionRateLimit = { kind: 'seven_day', percentUsed: 40 }

const SESSION_START = { cwd: '/repository', surface: 'terminal', isInteractive: true } as const
const TURN_START = { text: 'hello', turnId: 'turn-1' } as const
const TURN_COMPLETE = { answer: '', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' } as const
const BACKGROUND_AGENT: AgentInfo = { id: 'agent-1', description: 'research', type: 'general-purpose', status: 'running' }

type World = { contextTokens: number; agents: readonly AgentInfo[]; rateLimits?: readonly SessionRateLimit[] }

const simulateEngine = (on: On, world: World) => {
  const compactions: CommandRunInput[] = []
  const logs: string[] = []
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens: world.contextTokens, window: 1_000_000 }, rateLimits: [...(world.rateLimits ?? [])] },
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

  test('compacts a context over 200k tokens at the first idle check once a rate-limit window is above 95%', async ($, on) => {
    const world: World = { contextTokens: OVER_THRESHOLD, agents: [], rateLimits: [FIVE_HOUR_WINDOW, SEVEN_DAY_WINDOW] }
    const { compactions, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await runOneTurn($)

    world.rateLimits = [FIVE_HOUR_WINDOW, { ...SEVEN_DAY_WINDOW, percentUsed: 95 }]
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(0)
    world.rateLimits = [FIVE_HOUR_WINDOW, { ...SEVEN_DAY_WINDOW, percentUsed: 95.1 }]
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)
    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(1)
  })

  test('leaves a context at or under 200k tokens alone even above 95% usage', async ($, on) => {
    const world: World = { contextTokens: AT_THRESHOLD, agents: [], rateLimits: [{ ...FIVE_HOUR_WINDOW, percentUsed: 99 }] }
    const { compactions, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)

    await clock.advance(60 * MINUTE)
    expect(compactions).toHaveLength(0)
  })

  test('never compacts an open turn or a working background agent above 95% usage', async ($, on) => {
    const world: World = {
      contextTokens: OVER_THRESHOLD,
      agents: [BACKGROUND_AGENT],
      rateLimits: [{ ...FIVE_HOUR_WINDOW, percentUsed: 99 }],
    }
    const { compactions, clock } = simulateEngine(on, world)
    await $.session.start(SESSION_START)
    await $.turn.start(TURN_START)

    await clock.advance(10 * MINUTE)
    await $.turn.complete(TURN_COMPLETE)
    await clock.advance(10 * MINUTE)
    expect(compactions).toHaveLength(0)
    world.agents = []
    await clock.advance(1 * MINUTE)
    expect(compactions).toHaveLength(1)
  })
})
