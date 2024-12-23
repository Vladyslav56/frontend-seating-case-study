import { Button } from "@/components/ui/button.tsx"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { cn } from "@/lib/utils.ts"
import React from "react"

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	row: number
	place: number
	occupied: boolean
	ticketType?: string
	price?: number
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
	(props, ref) => {
		const isInCart = false
		return (
			<Popover>
				<PopoverTrigger>
					<div
						className={cn(
							`size-8 rounded-full transition-color ${
								props.occupied
									? "bg-red-200 hover:bg-red-300"
									: "bg-zinc-100 hover:bg-zinc-200"
							}`
						)}
						ref={ref}
					>
						<span className="text-xs text-zinc-400 font-medium">[n]</span>
					</div>
				</PopoverTrigger>
				<PopoverContent>
					<pre>
						{props.ticketType && <p>Ticket type: {props.ticketType}</p>}
						{props.price && <p>Price: {props.price}</p>}
						<p>Row: {props.row}</p>
						<p>Seat: {props.place}</p>
					</pre>

					<footer className="flex flex-col">
						{props.occupied ? (
							<p className="text-center">Seat is already occupied</p>
						) : isInCart ? (
							<Button disabled variant="destructive" size="sm">
								Remove from cart
							</Button>
						) : (
							<Button disabled variant="default" size="sm">
								Add to cart
							</Button>
						)}
					</footer>
				</PopoverContent>
			</Popover>
		)
	}
)
