import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const itemsTable = sqliteTable('inventory_items', {
	id: text().primaryKey(),
	name: text().notNull(),
	account: text().notNull(),
	count: integer().notNull().default(0),
	deletedAt: text('deleted_at'),
})
