import { eq, and, like, isNull, isNotNull, sql } from 'drizzle-orm'
import { itemsTable, db } from 'db'

export default {
	listItems: async ({ limit, offset, search, account }: { limit?: number; offset?: number; search?: string; account: string }) => {
		const conditions = [eq(itemsTable.account, account), isNull(itemsTable.deletedAt)]

		if (search !== undefined) {
			conditions.push(like(itemsTable.name, `%${search}%`))
		}

		if (limit != undefined && limit >= 20) limit = 20

		return db
			.select()
			.from(itemsTable)
			.where(and(...conditions))
			.limit(limit ?? 10)
			.offset(offset ?? 0)
	},

	listDeletedItems: async ({ limit, offset, search, account }: { limit?: number; offset?: number; search?: string; account: string }) => {
		const conditions = [eq(itemsTable.account, account), isNotNull(itemsTable.deletedAt)]

		if (search !== undefined) {
			conditions.push(like(itemsTable.name, `%${search}%`))
		}

		if (limit != undefined && limit >= 20) limit = 20

		return db
			.select()
			.from(itemsTable)
			.where(and(...conditions))
			.limit(limit ?? 10)
			.offset(offset ?? 0)
	},

	getItem: async ({ id, account }: { id: string; account: string }) => {
		return db
			.select()
			.from(itemsTable)
			.where(and(eq(itemsTable.id, id), eq(itemsTable.account, account)))
			.get()
	},

	createItem: async ({ name, account }: { name: string; account: string }) => {
		return db.insert(itemsTable).values({ id: crypto.randomUUID(), name, account }).returning().get()
	},

	updateItem: async ({ id, name, account }: { id: string; name?: string; account: string }) => {
		if (name === undefined) return

		return db
			.update(itemsTable)
			.set({ name })
			.where(and(eq(itemsTable.id, id), eq(itemsTable.account, account)))
			.returning()
			.get()
	},

	deleteItem: async ({ id, account }: { id: string; account: string }) => {
		return db
			.update(itemsTable)
			.set({ deletedAt: sql`(datetime('now'))` })
			.where(and(eq(itemsTable.id, id), eq(itemsTable.account, account)))
			.returning()
			.get()
	},
}
