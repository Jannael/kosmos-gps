import { eq, and, like, isNull, isNotNull, sql } from 'drizzle-orm'
import { itemsTable, db } from 'db'

export default {
	listItems: async ({ limit, offset, account }: { limit?: number; offset?: number; account: string }) => {
		if (limit != undefined && limit >= 20) limit = 20

		return db
			.select()
			.from(itemsTable)
			.where(and(eq(itemsTable.account, account), isNull(itemsTable.deletedAt)))
			.limit(limit ?? 10)
			.offset(offset ?? 0)
	},

	searchItems: async ({ limit, offset, search, account }: { limit?: number; offset?: number; search: string; account: string }) => {
		if (limit != undefined && limit >= 20) limit = 20

		return db
			.select()
			.from(itemsTable)
			.where(and(eq(itemsTable.account, account), isNull(itemsTable.deletedAt), like(itemsTable.name, `%${search}%`)))
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

	createItem: async ({ name, account, count }: { name: string; account: string; count?: number }) => {
		return db
			.insert(itemsTable)
			.values({ id: crypto.randomUUID(), name, account, count: count ?? 0 })
			.returning()
			.get()
	},

	updateItem: async ({
		id,
		name,
		account,
		count,
		deletedAt,
	}: {
		id: string
		name?: string
		account: string
		count?: number
		deletedAt?: string | null
	}) => {
		const set: Record<string, unknown> = {}
		if (name !== undefined) set.name = name
		if (count !== undefined) set.count = count
		if (deletedAt !== undefined) set.deletedAt = deletedAt

		if (Object.keys(set).length === 0) return

		return db
			.update(itemsTable)
			.set(set)
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
