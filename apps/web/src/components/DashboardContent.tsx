import { useSession } from '@/lib/auth-client'
import { UserDropdown } from '@/components/UserDropdown'

export function DashboardContent() {
	const { data: session, isPending } = useSession()

	if (isPending) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
			</div>
		)
	}

	if (!session) {
		return (
			<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
				<p className="text-gray-600">You need to sign in to view this page.</p>
				<a href="/" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">
					Go to Sign In
				</a>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-12">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
				<UserDropdown />
			</div>
			<div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-gray-900">Welcome, {session.user.name}!</h2>
				<div className="space-y-2 text-sm text-gray-600">
					<p>
						<span className="font-medium text-gray-900">Email:</span> {session.user.email}
					</p>
					<p>
						<span className="font-medium text-gray-900">User ID:</span> {session.user.id}
					</p>
					{session.user.emailVerified && (
						<p>
							<span className="font-medium text-gray-900">Email verified:</span> Yes
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
