import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { auth } from '@/auth'

const app = new Elysia()
	.use(
		cors({
			origin: ['http://localhost:4321'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	.all('/api/auth/*', ({ request }) => auth.handler(request))
	.get('/', () => 'Hello Elysia')
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
