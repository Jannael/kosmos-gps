import { signOut, useSession } from '@/lib/auth-client'

export function UserDropdown() {
	const { data: session, isPending } = useSession()

	if (isPending) {
		return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
	}

	if (!session) return null

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-3">
				{session.user.image ? (
					<img src={session.user.image} alt={session.user.name ?? 'Avatar'} className="h-8 w-8 rounded-full" />
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
						{session.user.name?.charAt(0)?.toUpperCase() ?? '?'}
					</div>
				)}
				<span className="text-sm font-medium text-gray-900">{session.user.name}</span>
			</div>
			<button
				type="button"
				onClick={() => signOut()}
				className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
			>
				Sign out
			</button>
		</div>
	)
}
