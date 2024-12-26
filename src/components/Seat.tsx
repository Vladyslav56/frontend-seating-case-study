import { Button } from "@/components/ui/button.tsx"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { cn } from "@/lib/utils.ts"
import React from "react"
import { useCart } from "./providers/CartProvider"
import { useTranslation } from "react-i18next"

// Props interface
interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	seatId?: string
	row: number
	place: number
	occupied: boolean
	ticketType?: string
	ticketTypeId?: string
	price?: number
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
	(props, ref) => {
		// Cart context and translation hooks
		const { t } = useTranslation()
		const { cart, addToCart, removeFromCart } = useCart()

		// Is item in cart check
		const isInCart = cart.some((seat) => seat.seatId === props.seatId)

		// Add to cart function
		const handleAddToCart = () => {
			if (
				!props.seatId ||
				!props.ticketType ||
				!props.price ||
				!props.ticketTypeId
			) {
				return
			}
			const CartItem = {
				seatId: props.seatId,
				row: props.row,
				place: props.place,
				ticketType: props.ticketType,
				ticketTypeId: props.ticketTypeId,
				price: props.price,
			}
			addToCart(CartItem)
		}

		// Romove from cart function
		const handleRemoveFromCart = () => {
			if (!props.seatId) {
				return
			}
			removeFromCart(props.seatId)
		}

		return (
			<Popover>
				<PopoverTrigger>
					{/* Seat button */}
					<div
						className={cn(
							`size-8 rounded-full transition-color ${
								props.occupied
									? "bg-red-200 hover:bg-red-300"
									: isInCart
									? "bg-green-200 hover:bg-green-300"
									: "bg-zinc-100 hover:bg-zinc-200"
							}`
						)}
						ref={ref}
					>
						<span className="text-xs text-zinc-400 font-medium">
							{props.place}
						</span>
					</div>
				</PopoverTrigger>
				<PopoverContent>
					{/* Seat description */}
					<pre>
						{props.ticketType && (
							<p>
								{t("ticketType")}: {props.ticketType}
							</p>
						)}
						{props.price && <p>Price: {props.price} CZK</p>}
						<p>
							{t("row")}: {props.row}
						</p>
						<p>
							{t("place")}: {props.place}
						</p>
					</pre>

					{/* Seat footer  */}
					<footer className="flex flex-col">
						{props.occupied ? (
							// Reserved message
							<p className="text-center">{t("reserved")}</p>
						) : isInCart ? (
							// Add to cart button
							<Button
								onClick={() => handleRemoveFromCart()}
								variant="destructive"
								size="sm"
							>
								{t("removeFromCart")}
							</Button>
						) : (
							// Remove from cart button
							<Button
								onClick={() => handleAddToCart()}
								variant="default"
								size="sm"
							>
								{t("addToCart")}
							</Button>
						)}
					</footer>
				</PopoverContent>
			</Popover>
		)
	}
)
