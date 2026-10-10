import type { AgentInfo, AgentStatus } from 'claude-code'

import type { Activity } from '../types'

export const POLICY = {
  idleMilliseconds: 20 * 60 * 1000,
  contextTokenThreshold: 200_000,
  rateLimitPercentThreshold: 95,
  checkIntervalMilliseconds: 60 * 1000,
} as const

const WORKING_AGENT_STATUSES: ReadonlySet<AgentStatus> = new Set(['pending', 'running', 'waiting'])

export const INITIAL_ACTIVITY: Activity = { kind: 'unobserved' }

export type Observation = {
  readonly now: number
  readonly contextTokens: number
  readonly highestRateLimitPercentUsed: number
  readonly hasWorkingAgents: boolean
}

export type ActivityEvent =
  | { readonly kind: 'session-started'; readonly at: number }
  | { readonly kind: 'turn-started' }
  | { readonly kind: 'turn-completed'; readonly at: number; readonly agentId?: string }
  | { readonly kind: 'checked'; readonly observation: Observation }

export const isWorking = (agent: AgentInfo): boolean => WORKING_AGENT_STATUSES.has(agent.status)

const isDueForCompaction = (
  idleSince: number,
  { now, contextTokens, highestRateLimitPercentUsed }: Observation,
): boolean =>
  contextTokens > POLICY.contextTokenThreshold &&
  (now - idleSince >= POLICY.idleMilliseconds || highestRateLimitPercentUsed > POLICY.rateLimitPercentThreshold)

const afterCheck = (activity: Activity, observation: Observation): Activity => {
  if (activity.kind !== 'idle') return activity
  if (observation.hasWorkingAgents) return { kind: 'idle', since: observation.now }
  if (isDueForCompaction(activity.since, observation)) return { kind: 'compacted', claimedAt: observation.now }
  return activity
}

export const transition = (activity: Activity, event: ActivityEvent): Activity => {
  switch (event.kind) {
    case 'session-started':
      return activity.kind === 'unobserved' ? { kind: 'idle', since: event.at } : activity
    case 'turn-started':
      return { kind: 'busy' }
    case 'turn-completed':
      return event.agentId === undefined ? { kind: 'idle', since: event.at } : activity
    case 'checked':
      return afterCheck(activity, event.observation)
  }
}

export const isClaimedBy = (activity: Activity, observation: Observation): boolean =>
  activity.kind === 'compacted' && activity.claimedAt === observation.now
