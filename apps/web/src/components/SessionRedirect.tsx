import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'

export function SessionRedirect() {
	const { data: session, isPending } = useSession()

	useEffect(() => {
		if (!isPending && session) {
			window.location.href = window.location.origin + '/dashboard'
		}
	}, [isPending, session])

	return null
}
