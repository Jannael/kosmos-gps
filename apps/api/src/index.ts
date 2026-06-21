import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { auth } from '@/auth'

const app = new Elysia()
	.use(
		cors({
			origin: [process.env.CLIENT_URL ?? 'http://localhost:4321'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	.all('/api/auth/*', ({ request }) => auth.handler(request))
	.listen(process.env.PORT ?? 3000)

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`)
