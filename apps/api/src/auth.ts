import { betterAuth } from 'better-auth'
import { createClient } from '@libsql/client'
import { LibsqlDialect } from '@libsql/kysely-libsql'

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
	trustedOrigins: ['http://localhost:4321'],
})

export type Session = typeof auth.$Infer.Session
