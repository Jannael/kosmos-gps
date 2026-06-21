import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('inventory_items', {
	id: text().primaryKey(),
	name: text().notNull(),
	enable: int('enable', { mode: 'boolean' }).notNull(),
	account: text().notNull(),
})
