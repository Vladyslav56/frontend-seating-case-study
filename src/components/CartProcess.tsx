import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons"
import { useCart } from "./providers/CartProvider"
import { Button } from "./ui/button"
import { useUser } from "./providers/UserProvider"
import { useState } from "react"
import { LoginContent } from "./LoginContent"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"

interface CartProcessProps {
	step: number
	onClose: () => void
	goToStep: (step: number) => void
	eventId: string | null
}

interface GuestData {
	firstName: string
	lastName: string
	email: string
}

export function CartProcess({
	step,
	onClose,
	goToStep,
	eventId,
}: CartProcessProps) {
	const { cart, removeFromCart, clearCart } = useCart()
	const { user } = useUser()
	const [guestData, setGuestData] = useState<GuestData>({
		firstName: "",
		lastName: "",
		email: "",
	})
	const [orderResults, setOrderResults] = useState<null | {
		message: string
		orderId: string
		tickets: any[]
		user: {
			email: string
			firstName: string
			lastName: string
		}
		totalAmount: number
	}>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGuestData({
			...guestData,
			[e.target.name]: e.target.value,
		})
	}

	const handleOrderSubmit = async () => {
		setIsLoading(true)
		try {
			const payload = {
				eventId: eventId,
				tickets: cart.map((item) => ({
					ticketTypeId: item.ticketTypeId,
					seatId: item.seatId,
				})),
				user: user || guestData,
			}

			const res = await axios.post(`${BASE_URL}/order`, payload)
			setOrderResults(res.data)
			goToStep(4)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	switch (step) {
		case 1:
			return (
				<div>
					<h2 className="text-center text-black text-lg mb-4">Your cart</h2>
					<div>
						{cart.length ? (
							cart.map((item) => (
								<div
									key={item.seatId}
									className="flex justify-between items-center p-2 mb-2 border-b border-black"
								>
									<div className="w-1/2">
										<p>Ticket type: {item.ticketType}</p>
										<p>
											Row: {item.row} Place: {item.place}
										</p>
									</div>
									<p>Price: {item.price} CZK</p>
									<Cross1Icon
										className="cursor-pointer"
										onClick={() => removeFromCart(item.seatId)}
									/>
								</div>
							))
						) : (
							<p className="mb-2 text-black">Cart is empty</p>
						)}
					</div>
					<p className="mb-4">
						Total price: {cart.reduce((total, item) => total + item.price, 0)}{" "}
						CZK
					</p>
					<div className="flex justify-between">
						<Button
							disabled={cart.length === 0}
							className="w-56"
							variant="destructive"
							onClick={() => clearCart()}
						>
							Clear cart
						</Button>
						<Button
							disabled={cart.length === 0}
							className="w-56"
							onClick={() => goToStep(2)}
						>
							Proceed to Checkout
						</Button>
					</div>
				</div>
			)
		case 2:
			if (user) {
				goToStep(3)
				console.log(step)
				return null
			} else {
				return (
					<div>
						<ArrowLeftIcon
							onClick={() => goToStep(1)}
							className="absolute w-6 h-6 top-5 left-5 cursor-pointer hover:opacity-60"
						/>
						<div className="mb-4 border-b border-black pb-4">
							<h2 className="text-center text-black text-lg mb-4">
								Enter your data
							</h2>
							<form className="flex flex-col gap-4 w-2/3 mx-auto">
								<input
									type="text"
									name="firstName"
									placeholder="Enter first name"
									value={guestData.firstName}
									onChange={handleChange}
									required
									className="bg-white p-1 border rounded border-black"
								/>
								<input
									type="text"
									name="lastName"
									placeholder="Enter last name"
									value={guestData.lastName}
									onChange={handleChange}
									required
									className="bg-white p-1 border rounded border-black"
								/>
								<input
									type="email"
									name="email"
									placeholder="Enter email"
									value={guestData.email}
									onChange={handleChange}
									required
									className="bg-white p-1 border rounded border-black"
								/>
								<Button onClick={() => goToStep(3)}>
									Continue like a guest
								</Button>
							</form>
						</div>
						<div>
							{" "}
							<LoginContent></LoginContent>
						</div>
					</div>
				)
			}

		case 3:
			return (
				<div className="flex flex-col gap-4">
					<ArrowLeftIcon
						onClick={() => {
							user ? goToStep(1) : goToStep(2)
						}}
						className="absolute w-6 h-6 top-5 left-5 cursor-pointer hover:opacity-60"
					/>
					<h2 className="text-center text-black text-lg mb-4">
						Your order data
					</h2>
					<p>
						Name:{" "}
						{user
							? user.firstName + " " + user.lastName
							: guestData.firstName + " " + guestData.lastName}{" "}
					</p>
					<p>Email: {user ? user.email : guestData.email}</p>
					<p>Number of tickets: {cart.length}</p>
					<p>
						Total price: {cart.reduce((total, item) => total + item.price, 0)}{" "}
						CZK
					</p>
					<Button disabled={isLoading} onClick={() => handleOrderSubmit()}>
						{isLoading ? "Processing" : "Confirm order"}
					</Button>
				</div>
			)
		case 4:
			return orderResults ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-center text-green-500 text-lg mb-4">
						{orderResults?.message}
					</h2>
					<p>Order ID: {orderResults?.orderId}</p>
					<p>
						Name: {orderResults?.user.firstName} {orderResults?.user.lastName}
					</p>
					<p>Tickets number: {orderResults?.tickets.length}</p>
					<p>Total price: {orderResults?.totalAmount} CZK</p>
					<Button onClick={() => (onClose(), clearCart())}>Close</Button>
				</div>
			) : (
				<div>
					<h2 className="text-center text-red-500 text-lg mb-4">
						Something went wrong
					</h2>
					<p>Please try again</p>
					<Button onClick={() => onClose()}>Close</Button>
				</div>
			)
	}
}
