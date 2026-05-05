import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'

const app = new Hono()

const schema = z.object({
  title: z.string().min(1),
})

export const route = app.post('/resources', zValidator('json', schema), (c) => {
  const body = c.req.valid('json')
  return c.json({ resource: body }, 201)
})

// Tests and clients sending JSON must include:
// headers: { 'Content-Type': 'application/json' }
