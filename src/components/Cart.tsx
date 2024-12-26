import { useTranslation } from "react-i18next"
import { useCart } from "./providers/CartProvider"
import { Button } from "./ui/button"

// Props interface
interface CartProps {
	onCartClick: () => void
}

function Cart({ onCartClick }: CartProps) {
	// Cart context and translation hooks
	const { t } = useTranslation()
	const { cart } = useCart()

	// Plural form function for total in cart state
	const getPlural = (count: number) => {
		if (count === 1) {
			return t("totalForTickets.one", { count })
		} else if (count >= 2 && count <= 4) {
			return t("totalForTickets.few", { count })
		} else {
			return t("totalForTickets.many", { count })
		}
	}

	return (
		<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
			{/* Inner content */}
			<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
				{/* Total in cart state */}
				<div className="flex flex-col">
					<span>{getPlural(cart.length)}</span>
					<span className="text-2xl font-semibold">
						{cart.reduce((total, item) => total + item.price, 0)} CZK
					</span>
				</div>

				{/* Checkout button */}
				<Button onClick={onCartClick} variant="default">
					{t("checkout")}
				</Button>
			</div>
		</nav>
	)
}

export default Cart
