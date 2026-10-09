export type Activity =
  | { readonly kind: 'unobserved' }
  | { readonly kind: 'busy' }
  | { readonly kind: 'idle'; readonly since: number }
  | { readonly kind: 'compacted'; readonly claimedAt: number }

declare module 'claude-code' {
  interface PluginState {
    'idle-compact': { activity: Activity }
  }
}
