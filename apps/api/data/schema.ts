import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const itemsTable = sqliteTable('inventory_items', {
	id: text().primaryKey(),
	name: text().notNull(),
	account: text().notNull(),
	deletedAt: text('deleted_at'),
})
