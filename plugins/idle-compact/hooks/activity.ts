import type { TurnCompleteReason } from 'claude-code'

import type { Activity, Cache, LimitResponse } from '../types'

const MINUTE = 60 * 1000

export const POLICY = {
  contextTokenThreshold: 200_000,
  limitWarningPercent: 95,
  limitAbortPercent: 98,
  maximumCacheRefreshLeadMilliseconds: 5 * MINUTE,
  checkIntervalMilliseconds: MINUTE,
  resumeDelayMilliseconds: MINUTE,
} as const

export const INITIAL_ACTIVITY: Activity = { kind: 'unobserved' }

export type RateLimitWindow = {
  readonly kind: string
  readonly percentUsed: number
  readonly resetsAt?: number
}

export type Observation = {
  readonly now: number
  readonly contextTokens: number
  readonly rateLimits: readonly RateLimitWindow[]
  readonly cacheLifetimeMilliseconds: number
}

export type ActivityEvent =
  | { readonly kind: 'turn-started'; readonly turnId: string; readonly at: number }
  | { readonly kind: 'requested'; readonly at: number }
  | { readonly kind: 'tool-batch-completed'; readonly toolUseId: string }
  | { readonly kind: 'turn-completed'; readonly reason: TurnCompleteReason; readonly observation: Observation }
  | { readonly kind: 'checked'; readonly observation: Observation }
  | { readonly kind: 'compaction-finished'; readonly observation: Observation }
  | { readonly kind: 'kept-alive'; readonly at: number; readonly cacheReadTokens: number }

export type Effect =
  | { readonly kind: 'compact' }
  | { readonly kind: 'keep-alive' }
  | { readonly kind: 'abort-turn'; readonly turnId: string }
  | { readonly kind: 'resume' }

const NO_LIMIT_RESPONSE: LimitResponse = { kind: 'none' }

const isLarge = ({ contextTokens }: Observation): boolean => contextTokens > POLICY.contextTokenThreshold

const mostUsedWindow = ({ rateLimits }: Observation): RateLimitWindow | undefined =>
  rateLimits.reduce<RateLimitWindow | undefined>(
    (most, window) => (most === undefined || window.percentUsed > most.percentUsed ? window : most),
    undefined,
  )

const percentUsed = (window: RateLimitWindow | undefined): number => window?.percentUsed ?? 0

const isExhausted = (window: RateLimitWindow | undefined): boolean => percentUsed(window) >= 100

const isNearLimit = (window: RateLimitWindow | undefined): boolean => percentUsed(window) > POLICY.limitWarningPercent

const cacheAge = (cache: Cache, { now }: Observation): number =>
  cache.kind === 'warm' ? now - cache.touchedAt : Number.POSITIVE_INFINITY

const isCacheWarm = (cache: Cache, observation: Observation): boolean =>
  cacheAge(cache, observation) < observation.cacheLifetimeMilliseconds

const isCacheExpiring = (cache: Cache, observation: Observation): boolean => {
  const lead = Math.min(POLICY.maximumCacheRefreshLeadMilliseconds, observation.cacheLifetimeMilliseconds / 2)
  return isCacheWarm(cache, observation) && cacheAge(cache, observation) >= observation.cacheLifetimeMilliseconds - lead
}

const resumeAfterTurn = (
  limit: LimitResponse,
  reason: TurnCompleteReason,
  observation: Observation,
): number | undefined => {
  if (limit.kind === 'aborting') return limit.resetsAt
  if (limit.kind === 'warned' && reason !== 'aborted') return limit.resetsAt
  const window = mostUsedWindow(observation)
  return reason === 'error' && isExhausted(window) ? window?.resetsAt : undefined
}

const afterTurn = (
  working: Extract<Activity, { kind: 'working' }>,
  reason: TurnCompleteReason,
  observation: Observation,
): Activity => {
  const resetsAt = resumeAfterTurn(working.limit, reason, observation)
  return {
    kind: 'resting',
    cache: working.cache,
    compaction: { kind: 'due' },
    ...(resetsAt !== undefined && { resume: { kind: 'scheduled', at: resetsAt + POLICY.resumeDelayMilliseconds } }),
  }
}

const checkWorking = (working: Extract<Activity, { kind: 'working' }>, observation: Observation): Activity => {
  if (!isLarge(observation)) return working
  const window = mostUsedWindow(observation)
  if (isExhausted(window)) return working
  if (percentUsed(window) >= POLICY.limitAbortPercent && working.limit.kind !== 'aborting') {
    return { ...working, limit: { kind: 'aborting', claimedAt: observation.now, resetsAt: window?.resetsAt } }
  }
  if (isNearLimit(window) && working.limit.kind === 'none') {
    return { ...working, limit: { kind: 'warning-due', resetsAt: window?.resetsAt } }
  }
  if (working.keepAlive === undefined && isCacheExpiring(working.cache, observation)) {
    return { ...working, keepAlive: { claimedAt: observation.now } }
  }
  return working
}

const checkResting = (resting: Extract<Activity, { kind: 'resting' }>, observation: Observation): Activity => {
  if (resting.resume?.kind === 'scheduled' && observation.now >= resting.resume.at) {
    return { ...resting, resume: { kind: 'sent', claimedAt: observation.now } }
  }
  if (resting.compaction.kind !== 'due' || !isLarge(observation)) return resting
  if (!isCacheWarm(resting.cache, observation)) return { ...resting, compaction: { kind: 'lapsed' } }
  const window = mostUsedWindow(observation)
  if (isExhausted(window)) return resting
  if (isNearLimit(window) || isCacheExpiring(resting.cache, observation)) {
    return { ...resting, compaction: { kind: 'running', claimedAt: observation.now } }
  }
  return resting
}

export const transition = (activity: Activity, event: ActivityEvent): Activity => {
  switch (event.kind) {
    case 'turn-started':
      return { kind: 'working', turnId: event.turnId, cache: { kind: 'warm', touchedAt: event.at }, limit: NO_LIMIT_RESPONSE }
    case 'requested':
      return activity.kind === 'working' ? { ...activity, cache: { kind: 'warm', touchedAt: event.at } } : activity
    case 'tool-batch-completed':
      return activity.kind === 'working' && activity.limit.kind === 'warning-due'
        ? { ...activity, limit: { kind: 'warned', toolUseId: event.toolUseId, resetsAt: activity.limit.resetsAt } }
        : activity
    case 'turn-completed':
      return activity.kind === 'working' ? afterTurn(activity, event.reason, event.observation) : activity
    case 'checked':
      if (activity.kind === 'working') return checkWorking(activity, event.observation)
      if (activity.kind === 'resting') return checkResting(activity, event.observation)
      return activity
    case 'compaction-finished':
      return activity.kind === 'resting' && activity.compaction.kind === 'running'
        ? { ...activity, compaction: isLarge(event.observation) ? { kind: 'due' } : { kind: 'done' } }
        : activity
    case 'kept-alive':
      if (activity.kind !== 'working' || activity.keepAlive === undefined) return activity
      return {
        kind: 'working',
        turnId: activity.turnId,
        limit: activity.limit,
        cache: event.cacheReadTokens > 0 ? { kind: 'warm', touchedAt: event.at } : { kind: 'lost' },
      }
  }
}

export const claimedEffect = (activity: Activity, { now }: Observation): Effect | undefined => {
  if (activity.kind === 'working') {
    if (activity.limit.kind === 'aborting' && activity.limit.claimedAt === now) {
      return { kind: 'abort-turn', turnId: activity.turnId }
    }
    if (activity.keepAlive?.claimedAt === now) return { kind: 'keep-alive' }
  }
  if (activity.kind === 'resting') {
    if (activity.resume?.kind === 'sent' && activity.resume.claimedAt === now) return { kind: 'resume' }
    if (activity.compaction.kind === 'running' && activity.compaction.claimedAt === now) return { kind: 'compact' }
  }
  return undefined
}

export const warningFor = (
  activity: Activity,
  toolUseId: string,
): Extract<LimitResponse, { kind: 'warned' }> | undefined =>
  activity.kind === 'working' && activity.limit.kind === 'warned' && activity.limit.toolUseId === toolUseId
    ? activity.limit
    : undefined

export const cacheLifetimeMilliseconds = (promptCacheTtl: unknown): number =>
  promptCacheTtl === '5m' ? 5 * MINUTE : 60 * MINUTE
