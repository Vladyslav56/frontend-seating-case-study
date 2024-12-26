import { useState } from "react"
import { Button } from "./ui/button"
import { useUser } from "./providers/UserProvider"
import { useTranslation } from "react-i18next"

interface LoginContentProps {
	onClose?: () => void
}

export function LoginContent({ onClose }: LoginContentProps) {
	const { t } = useTranslation()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const { login } = useUser()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const res = await login(email, password)

		if (res) {
			setErrorMessage(null)

			if (onClose) onClose()
		} else {
			setErrorMessage(t("invalid"))
		}
	}

	return (
		<div>
			<h2 className="text-center text-black text-lg mb-4">{t("login")}</h2>
			<form
				className="flex flex-col gap-4 w-2/3 mx-auto"
				onSubmit={handleSubmit}
			>
				<input
					type="email"
					placeholder={t("enterEmail")}
					value={email}
					onChange={(e) => {
						setEmail(e.target.value)
					}}
					required
					className="bg-white py-1 px-2 border rounded-md border-zinc-500"
				/>
				<input
					type="password"
					placeholder={t("enterPassword")}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="bg-white py-1 px-2 border rounded-md border-zinc-500"
				/>
				{errorMessage && (
					<p className="text-red-500 text-center">{errorMessage}</p>
				)}
				<Button type="submit" variant="default">
					{t("login")}
				</Button>
			</form>
		</div>
	)
}
