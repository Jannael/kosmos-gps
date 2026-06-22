import { useItemsStore, type Item } from '@/store/items'

export function DeletedItemRow({ item }: { item: Item }) {
	const recoverItem = useItemsStore((s) => s.recoverItem)
	const permanentlyDeleteItem = useItemsStore((s) => s.permanentlyDeleteItem)

	return (
		<tr className="border-b border-gray-50 last:border-0">
			<td className="px-6 py-4">
				<span className="font-medium text-gray-900">{item.name}</span>
			</td>
			<td className="px-6 py-4 text-sm text-gray-400">{new Date(item.deletedAt!).toLocaleDateString()}</td>
			<td className="px-6 py-4">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={async () => {
							if (confirm('Restore this item?')) {
								await recoverItem(item.id)
							}
						}}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={async () => {
							if (confirm('Permanently delete this item? This cannot be undone.')) {
								await permanentlyDeleteItem(item.id)
							}
						}}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
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
			</td>
		</tr>
	)
}
