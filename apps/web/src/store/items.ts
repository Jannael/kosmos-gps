import { create } from 'zustand'
import { getClient } from '@/lib/eden'

export type Item = {
	id: string
	name: string
	account: string
	count: number
	deletedAt: string | null
}

type ItemsStore = {
	items: Item[]
	search: string
	loading: boolean
	setSearch: (search: string) => void
	setItems: (items: Item[]) => void
	fetchItems: () => Promise<void>
	addItem: (name: string, count?: number) => Promise<void>
}

export const useItemsStore = create<ItemsStore>()((set, get) => ({
	items: [],
	search: '',
	loading: false,
	setSearch: (search) => set({ search }),
	setItems: (items) => set({ items }),
	fetchItems: async () => {
		const { search } = get()
		set({ loading: true })
		const { data, error } = await getClient().api.inventory.list.get({
			query: search ? { search } : undefined,
		})
		if (error) {
			console.error('Failed to fetch items', error)
		} else {
			set({ items: data ?? [] })
		}
		set({ loading: false })
	},
	addItem: async (name, count) => {
		const { error } = await getClient().api.inventory.add.post({ name, count })
		if (error) {
			console.error('Failed to add item', error)
			return
		}
		await get().fetchItems()
	},
}))
