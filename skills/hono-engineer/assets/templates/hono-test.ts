import { describe, expect, it } from 'vitest'
import app from './app'

describe('Hono app', () => {
  it('handles JSON requests', async () => {
    const res = await app.request('/resources', {
      method: 'POST',
      body: JSON.stringify({ title: 'Hono' }),
      headers: { 'Content-Type': 'application/json' },
    })

    expect(res.status).toBe(201)
  })

  it('receives mock env bindings', async () => {
    const res = await app.request('/health', {}, { API_TOKEN: 'test-token' })
    expect(res.status).toBe(200)
  })
})
