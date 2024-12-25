import { useState } from "react"
import { Button } from "./ui/button"
import { useUser } from "./providers/UserProvider"

interface LoginContentProps {
	onClose?: () => void
}

export function LoginContent({ onClose }: LoginContentProps) {
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
			setErrorMessage("Invalid mail or password")
		}
	}

	return (
		<div>
			<h2 className="text-center text-black text-lg mb-4">Login</h2>
			<form
				className="flex flex-col gap-4 w-2/3 mx-auto"
				onSubmit={handleSubmit}
			>
				<input
					type="email"
					placeholder="Enter email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value)
					}}
					required
					className="bg-white p-1 border rounded border-black"
				/>
				<input
					type="password"
					placeholder="Enter password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="bg-white p-1 border rounded border-black"
				/>
				{errorMessage && (
					<p className="text-red-500 text-center">{errorMessage}</p>
				)}
				<Button type="submit" variant="default">
					Login
				</Button>
			</form>
		</div>
	)
}
