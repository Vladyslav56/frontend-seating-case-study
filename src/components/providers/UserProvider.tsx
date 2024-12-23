import { BASE_URL } from "@/lib/utils"
import axios from "axios"
import { createContext, useContext, useState } from "react"

interface User {
	firstName: string
	lastName: string
	email: string
}

interface UserContextType {
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)

	const login = async (email: string, password: string) => {
		try {
			const res = await axios.post(`${BASE_URL}/login`, { email, password })
			const { user } = res.data
			setUser(user)
		} catch (error) {
			console.error(error)
		}
	}

	const logout = () => {
		setUser(null)
	}

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	)
}

function useUser(): UserContextType {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error("useUser must be used inside UserProvider")
	}
	return context
}

export { UserProvider, useUser }
