import { signIn } from '@/lib/auth-client'
import AstroJson from './../../astro.config.mjs'

export function SignInButton() {
	return (
		<button
			type="button"
			onClick={() => signIn.social({ provider: 'github', callbackURL: AstroJson.site + '/dashboard' })}
			className="bg-primary shadow-primary/25 hover:bg-primary/90 inline-flex cursor-pointer items-center gap-3 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
		>
			<img src="/github.svg" alt="" className="h-5 w-5" />
			Iniciar sesión con GitHub
		</button>
	)
}
