import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { auth } from '@/auth'
import routes from 'routes'
import { openapi, fromTypes } from '@elysia/openapi'

const app = new Elysia({ prefix: '/api' })
	.use(
		openapi({
			references: fromTypes(),
		}),
	)
	.use(
		cors({
			origin: [process.env.CLIENT_URL ?? 'http://localhost:4321'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	)

	.all('/auth/*', ({ request }) => auth.handler(request))

	// routers
	.use(routes.items)

	.listen(process.env.PORT ?? 3000)

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app

export default app
