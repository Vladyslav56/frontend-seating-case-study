import { useCart } from "./providers/CartProvider"
import { Button } from "./ui/button"

function Cart() {
	const { cart } = useCart()

	const totalPrice = cart.reduce((total, item) => total + item.price, 0)

	return (
		<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
				{/* total in cart state */}
				<div className="flex flex-col">
					<span>Total for {cart.length} tickets</span>
					<span className="text-2xl font-semibold">{totalPrice} CZK</span>
				</div>

				{/* checkout button */}
				<Button disabled variant="default">
					Checkout now
				</Button>
			</div>
		</nav>
	)
}

export default Cart
