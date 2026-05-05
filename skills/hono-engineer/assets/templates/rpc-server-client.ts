// server.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'

const route = new Hono().post(
  '/resources',
  zValidator('json', z.object({ title: z.string() })),
  (c) => c.json({ resource: c.req.valid('json') }, 201)
)

export type AppType = typeof route
export default route

// client.ts
import { hc, type InferRequestType, type InferResponseType } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('http://localhost:8787/')
const $post = client.resources.$post

type CreateResourceInput = InferRequestType<typeof $post>['json']
type CreateResourceResponse = InferResponseType<typeof $post, 201>

export async function createResource(input: CreateResourceInput): Promise<CreateResourceResponse> {
  const res = await $post({ json: input })
  return res.json()
}
