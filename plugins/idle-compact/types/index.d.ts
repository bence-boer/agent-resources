export type Claim = { readonly claimedAt: number }

export type LimitResponse =
  | { readonly kind: 'none' }
  | { readonly kind: 'warning-due'; readonly resetsAt?: number }
  | { readonly kind: 'warned'; readonly toolUseId: string; readonly resetsAt?: number }
  | { readonly kind: 'aborting'; readonly claimedAt: number; readonly resetsAt?: number }

export type Compaction =
  | { readonly kind: 'due' }
  | { readonly kind: 'running'; readonly claimedAt: number }
  | { readonly kind: 'done' }
  | { readonly kind: 'lapsed' }

export type Resume = { readonly kind: 'scheduled'; readonly at: number } | { readonly kind: 'sent'; readonly claimedAt: number }

export type Cache = { readonly kind: 'warm'; readonly touchedAt: number } | { readonly kind: 'lost' }

export type Activity =
  | { readonly kind: 'unobserved' }
  | {
      readonly kind: 'working'
      readonly turnId: string
      readonly cache: Cache
      readonly limit: LimitResponse
      readonly keepAlive?: Claim
    }
  | {
      readonly kind: 'resting'
      readonly cache: Cache
      readonly compaction: Compaction
      readonly resume?: Resume
    }

declare module 'claude-code' {
  interface PluginState {
    'idle-compact': { activity: Activity }
  }
}
