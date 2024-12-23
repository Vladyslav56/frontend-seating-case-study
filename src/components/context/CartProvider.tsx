import { createContext, useContext, useState } from "react"

interface CartItem {
	seatId: string
	row: number
	place: number
	ticketType: string
	price: number
}

interface CartContextType {
	cart: CartItem[]
	addToCart: (item: CartItem) => void
	removeFromCart: (seatId: string) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([])

	const addToCart = (item: CartItem) => {
		setCart((prev) => [...prev, item])
	}

	const removeFromCart = (seatId: string) => {
		setCart((prev) => prev.filter((item) => item.seatId !== seatId))
	}

	const clearCart = () => {
		setCart([])
	}

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, clearCart }}
		>
			{children}
		</CartContext.Provider>
	)
}

function useCart(): CartContextType {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error("useCart must be used inside CartProvider")
	}
	return context
}

export { CartProvider, useCart }
