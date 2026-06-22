import { betterAuth } from 'better-auth'
import { createClient } from '@libsql/client'
import { LibsqlDialect } from '@libsql/kysely-libsql'

const isHttps = Boolean(process.env.BETTER_AUTH_URL?.startsWith('https://'))

export const auth = betterAuth({
	database: {
		dialect: new LibsqlDialect({
			client: createClient({
				url: process.env.TURSO_DATABASE_URL!,
				authToken: process.env.TURSO_AUTH_TOKEN,
			}),
		}),
		type: 'sqlite',
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	trustedOrigins: [process.env.CLIENT_URL ?? 'http://localhost:4321'],
	advanced: {
		defaultCookieAttributes: {
			sameSite: isHttps ? 'none' : 'lax',
		},
	},
})

export type Session = typeof auth.$Infer.Session
