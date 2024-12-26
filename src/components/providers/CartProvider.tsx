import { createContext, useContext, useState } from "react"

// Cart item interface
interface CartItem {
	seatId: string
	row: number
	place: number
	ticketType: string
	ticketTypeId: string
	price: number
}

// Cart context interface
interface CartContextType {
	cart: CartItem[]
	addToCart: (item: CartItem) => void
	removeFromCart: (seatId: string) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function CartProvider({ children }: { children: React.ReactNode }) {
	// Cart state
	const [cart, setCart] = useState<CartItem[]>([])

	// Add item to cart function
	const addToCart = (item: CartItem) => {
		setCart((prev) => [...prev, item])
	}

	// Remove item from cart function
	const removeFromCart = (seatId: string) => {
		setCart((prev) => prev.filter((item) => item.seatId !== seatId))
	}

	// Clear cart function
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

// Cart context hook
function useCart(): CartContextType {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error("useCart must be used inside CartProvider")
	}
	return context
}

export { CartProvider, useCart }
