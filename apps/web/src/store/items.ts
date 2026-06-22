import { create } from 'zustand'
import { getClient } from '@/lib/eden'

export type Item = {
	id: string
	name: string
	account: string
	count: number
	deletedAt: string | null
}

const PAGE_SIZE = 20

type ItemsStore = {
	items: Item[]
	search: string
	loading: boolean
	offset: number
	hasMore: boolean
	showingDeleted: boolean
	setSearch: (search: string) => void
	setItems: (items: Item[]) => void
	setShowingDeleted: (showing: boolean) => void
	fetchItems: (reset?: boolean) => Promise<void>
	addItem: (name: string, count?: number) => Promise<void>
	updateItemName: (id: string, name: string) => Promise<void>
	updateCount: (id: string, newCount: number) => Promise<void>
	deleteItem: (id: string) => Promise<void>
	recoverItem: (id: string) => Promise<void>
	permanentlyDeleteItem: (id: string) => Promise<void>
}

export const useItemsStore = create<ItemsStore>()((set, get) => ({
	items: [],
	search: '',
	loading: false,
	offset: 0,
	hasMore: true,
	showingDeleted: false,
	setSearch: (search) => set({ search }),
	setItems: (items) => set({ items }),
	setShowingDeleted: (showingDeleted) => {
		set({ showingDeleted })
		get().fetchItems()
	},
	fetchItems: async (reset = true) => {
		const { search, offset, showingDeleted } = get()
		const nextOffset = reset ? 0 : offset
		set({ loading: true })
		const { data, error } = await getClient().api.inventory.list.get({
			query: { limit: PAGE_SIZE, offset: nextOffset, ...(search ? { search } : {}), ...(showingDeleted ? { deleted: true } : {}) },
		})
		if (error) {
			console.error('Failed to fetch items', error)
		} else {
			const fetched = data ?? []
			set({
				items: reset ? fetched : [...get().items, ...fetched],
				offset: nextOffset + fetched.length,
				hasMore: fetched.length === PAGE_SIZE,
			})
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
	updateItemName: async (id, name) => {
		const prev = get().items
		const idx = prev.findIndex((i) => i.id === id)
		if (idx === -1) return
		const oldName = prev[idx].name
		const updated = { ...prev[idx], name }
		set({ items: [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)] })
		const { error } = await getClient().api.inventory.update.put({ id, name })
		if (error) {
			const reverted = { ...updated, name: oldName }
			set({ items: [...get().items.slice(0, idx), reverted, ...get().items.slice(idx + 1)] })
		}
	},
	updateCount: async (id, newCount) => {
		const prev = get().items
		const idx = prev.findIndex((i) => i.id === id)
		if (idx === -1) return
		const oldCount = prev[idx].count
		const updated = { ...prev[idx], count: newCount }
		set({ items: [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)] })
		const { error } = await getClient().api.inventory.update.put({ id, count: newCount })
		if (error) {
			const reverted = { ...updated, count: oldCount }
			set({ items: [...get().items.slice(0, idx), reverted, ...get().items.slice(idx + 1)] })
		}
	},
	deleteItem: async (id) => {
		const { error } = await getClient().api.inventory.update.put({
			id,
			deletedAt: new Date().toISOString(),
		})
		if (error) {
			console.error('Failed to delete item', error)
			return
		}
		await get().fetchItems()
	},
	recoverItem: async (id) => {
		const { error } = await getClient().api.inventory.update.put({ id, deletedAt: null })
		if (error) {
			console.error('Failed to recover item', error)
			return
		}
		await get().fetchItems()
	},
	permanentlyDeleteItem: async (id) => {
		const { error } = await getClient().api.inventory({ id }).delete()
		if (error) {
			console.error('Failed to permanently delete item', error)
			return
		}
		await get().fetchItems()
	},
}))
