import { useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { UserDropdown } from '@/components/UserDropdown'
import { SearchBar } from '@/components/SearchBar'
import { AddItemForm } from '@/components/AddItemForm'
import { ItemRow } from '@/components/ItemRow'
import { DeletedItemRow } from '@/components/DeletedItemRow'
import { useItemsStore } from '@/store/items'

export function DashboardContent() {
	const { data: session, isPending } = useSession()
	const { items, loading, hasMore, showingDeleted, fetchItems, setShowingDeleted } = useItemsStore()

	useEffect(() => {
		fetchItems()
	}, [fetchItems])

	if (isPending) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[var(--color-primary)]" />
			</div>
		)
	}

	if (!session) {
		return (
			<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
				<p className="text-gray-600">You need to sign in to view this page.</p>
				<a
					href="/"
					className="rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90"
				>
					Go to Sign In
				</a>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">{showingDeleted ? 'Papelera' : 'Inventario'}</h1>
				<UserDropdown />
			</div>

			<div className="mb-6 flex items-center gap-3">
				<div className="flex-1">
					<SearchBar />
				</div>
				{!showingDeleted && <AddItemForm />}
				<button
					type="button"
					onClick={() => setShowingDeleted(!showingDeleted)}
					className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
						showingDeleted
							? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
							: 'border-gray-300 text-gray-500 hover:bg-gray-100'
					}`}
				>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[var(--color-primary)]" />
					</div>
				) : items.length === 0 ? (
					<div className="py-20 text-center text-sm text-gray-400">No hay items</div>
				) : showingDeleted ? (
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-100 text-xs font-semibold tracking-wider text-gray-400 uppercase">
								<th className="px-6 py-4">Nombre</th>
								<th className="px-6 py-4">Fecha eliminación</th>
								<th className="px-6 py-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<DeletedItemRow key={item.id} item={item} />
							))}
						</tbody>
					</table>
				) : (
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-100 text-xs font-semibold tracking-wider text-gray-400 uppercase">
								<th className="px-6 py-4">Nombre</th>
								<th className="px-6 py-4">Cantidad</th>
								<th className="px-6 py-4">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<ItemRow key={item.id} item={item} />
							))}
						</tbody>
					</table>
				)}
				{hasMore && !loading && items.length > 0 && (
					<div className="flex justify-center border-t border-gray-100 px-6 py-4">
						<button
							type="button"
							onClick={() => fetchItems(false)}
							className="cursor-pointer rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Cargar más
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
