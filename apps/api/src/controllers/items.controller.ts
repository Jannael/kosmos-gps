import model from '@/model/items.model'

export default {
	list: async ({ limit, offset, search, account }: { limit?: number; offset?: number; search?: string; account: string }) => {
		return model.listItems({ limit, offset, search, account })
	},

	get: async ({ id, account }: { id: string; account: string }) => {
		return model.getItem({ id, account })
	},

	post: async ({ name, account, count }: { name: string; account: string; count?: number }) => {
		return model.createItem({ name, account, count })
	},

	update: async ({
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
		return model.updateItem({ id, name, account, count, deletedAt })
	},

	delete: async ({ id, account }: { id: string; account: string }) => {
		return model.deleteItem({ id, account })
	},
}
