import { Elysia, t } from 'elysia'
import { auth } from '@/auth'
import controllers from 'controllers'

const router = new Elysia({ prefix: '/inventory' })
	.derive(async ({ request, set }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		if (!session) {
			set.status = 401
			throw new Error('Unauthorized')
		}
		return { user: session.user }
	})

	.get('/list', ({ query, user }) => controllers.items.list({ ...query, account: user.email }), {
		query: t.Object({
			limit: t.Optional(t.Number()),
			offset: t.Optional(t.Number()),
			search: t.Optional(t.String()),
			deleted: t.Optional(t.Boolean()),
		}),
	})

	.get('/item/:id', ({ params, user }) => controllers.items.get({ ...params, account: user.email }), {
		params: t.Object({
			id: t.String(),
		}),
	})

	.post('/add', ({ body, user }) => controllers.items.post({ ...body, account: user.email }), {
		body: t.Object({
			name: t.String(),
			count: t.Optional(t.Number()),
		}),
	})

	.put('/update', ({ body, user }) => controllers.items.update({ ...body, account: user.email }), {
		body: t.Object({
			id: t.String(),
			name: t.Optional(t.String()),
			count: t.Optional(t.Number()),
			deletedAt: t.Optional(t.Nullable(t.String())),
		}),
	})

	.delete('/:id', ({ params, user }) => controllers.items.delete({ ...params, account: user.email }), {
		params: t.Object({
			id: t.String(),
		}),
	})

export default router
