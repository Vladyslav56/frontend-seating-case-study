import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons"
import { useCart } from "./providers/CartProvider"
import { Button } from "./ui/button"
import { useUser } from "./providers/UserProvider"
import { useState } from "react"
import { LoginContent } from "./LoginContent"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import { useTranslation } from "react-i18next"

// Guest data interface
interface GuestData {
	firstName: string
	lastName: string
	email: string
}

// Props interface
interface CartProcessProps {
	step: number
	onClose: () => void
	goToStep: (step: number) => void
	eventId: string | null
}

export function CartProcess({
	step,
	onClose,
	goToStep,
	eventId,
}: CartProcessProps) {
	// User and cart contexts, translation hooks
	const { t } = useTranslation()
	const { cart, removeFromCart, clearCart } = useCart()
	const { user } = useUser()
	// Guest data, order results and loading states
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

	// Guest data change function
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGuestData({
			...guestData,
			[e.target.name]: e.target.value,
		})
	}

	// Order submit function
	const handleOrderSubmit = async () => {
		setIsLoading(true)
		try {
			// Payload formation
			const payload = {
				eventId: eventId,
				tickets: cart.map((item) => ({
					ticketTypeId: item.ticketTypeId,
					seatId: item.seatId,
				})),
				user: user || guestData,
			}

			// Fetching order
			const res = await axios.post(`${BASE_URL}/order`, payload)
			setOrderResults(res.data)
			goToStep(4)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	// Cart process steps switcher
	switch (step) {
		// Cart overview step
		case 1:
			return (
				// Inner content
				<div>
					<h2 className="text-center text-black text-lg mb-4">
						{t("yourCart")}
					</h2>
					{/* Cart items mapping */}
					<div>
						{cart.length ? (
							cart.map((item) => (
								// Cart item description
								<div
									key={item.seatId}
									className="flex justify-between items-center p-2 mb-2 border-b border-black flex-wrap text-sm sm:text-base"
								>
									<div className="w-1/2">
										<p>
											{t("ticketType")}: {item.ticketType}
										</p>
										<p>
											{t("row")}: {item.row} {t("place")}: {item.place}
										</p>
									</div>
									<p>
										{t("price")}: {item.price} CZK
									</p>
									{/* Remove from cart button */}
									<Cross1Icon
										className="cursor-pointer"
										onClick={() => removeFromCart(item.seatId)}
									/>
								</div>
							))
						) : (
							// Cart is empty message
							<p className="mb-2 text-black">{t("empty")}</p>
						)}
					</div>
					{/* Total price */}
					<p className="mb-4 text-zinc-900">
						{t("totalPrice")}:{" "}
						{cart.reduce((total, item) => total + item.price, 0)} CZK
					</p>
					<div className="flex justify-around">
						{/* Clear cart button */}
						<Button
							disabled={cart.length === 0}
							className="w-5/12"
							variant="destructive"
							onClick={() => clearCart()}
						>
							{t("clearCart")}
						</Button>
						{/* Next step button */}
						<Button
							disabled={cart.length === 0}
							className="w-5/12"
							onClick={() => goToStep(2)}
						>
							{t("order")}
						</Button>
					</div>
				</div>
			)

		// Continue like a guest or login step
		case 2:
			// Skip step if user already logged in
			if (user) {
				goToStep(3)
				console.log(step)
				return null
			} else {
				return (
					// Inner content
					<div>
						{/* Previous step button */}
						<ArrowLeftIcon
							onClick={() => goToStep(1)}
							className="absolute w-6 h-6 top-5 left-5 cursor-pointer hover:opacity-60"
						/>
						{/* Continue like a guest content */}
						<div className="mb-4 border-b border-black pb-4">
							<h2 className="text-center text-black text-lg mb-4">
								{t("enterData")}
							</h2>
							{/* Continue like a guest form */}
							<form className="flex flex-col gap-4 w-2/3 mx-auto">
								<input
									type="text"
									name="firstName"
									placeholder={t("enterFirstName")}
									value={guestData.firstName}
									onChange={handleChange}
									required
									className="bg-white py-1 px-2 border rounded-md border-zinc-500"
								/>
								<input
									type="text"
									name="lastName"
									placeholder={t("enterLastName")}
									value={guestData.lastName}
									onChange={handleChange}
									required
									className="bg-white py-1 px-2 border rounded-md border-zinc-500"
								/>
								<input
									type="email"
									name="email"
									placeholder={t("enterEmail")}
									value={guestData.email}
									onChange={handleChange}
									required
									className="bg-white py-1 px-2 border rounded-md border-zinc-500"
								/>
								{/* Continue like a guest button */}
								<Button
									onClick={() =>
										guestData.email &&
										guestData.firstName &&
										guestData.lastName &&
										goToStep(3)
									}
								>
									{t("guestContinue")}
								</Button>
							</form>
						</div>
						<div>
							{/* Login form */}
							<LoginContent></LoginContent>
						</div>
					</div>
				)
			}

		// Order data overview step
		case 3:
			return (
				// Inner content
				<div className="flex flex-col gap-4">
					{/* Previous step button */}
					<ArrowLeftIcon
						onClick={() => {
							user ? goToStep(1) : goToStep(2)
						}}
						className="absolute w-6 h-6 top-5 left-5 cursor-pointer hover:opacity-60"
					/>
					<h2 className="text-center text-black text-lg mb-4">
						{t("orderData")}
					</h2>
					{/* Order data */}
					<p>
						{t("name")}:{" "}
						{user
							? user.firstName + " " + user.lastName
							: guestData.firstName + " " + guestData.lastName}{" "}
					</p>
					<p>Email: {user ? user.email : guestData.email}</p>
					<p>
						{t("ticketsNumber")}: {cart.length}
					</p>
					<p>
						Total price: {cart.reduce((total, item) => total + item.price, 0)}{" "}
						CZK
					</p>
					{/* Order button */}
					<Button disabled={isLoading} onClick={() => handleOrderSubmit()}>
						{isLoading ? t("process") : t("confirm")}
					</Button>
				</div>
			)

		// Order results step
		case 4:
			// Is order success check
			return orderResults ? (
				// Success order overview
				<div className="flex flex-col gap-4">
					<h2 className="text-center text-green-500 text-lg mb-4">
						{orderResults?.message}
					</h2>
					<p>
						{t("orderId")}: {orderResults?.orderId}
					</p>
					<p>
						{t("name")}: {orderResults?.user.firstName}{" "}
						{orderResults?.user.lastName}
					</p>
					<p>
						{t("ticketsNumber")}: {orderResults?.tickets.length}
					</p>
					<p>
						{t("totalPrice")}: {orderResults?.totalAmount} CZK
					</p>
					{/* Close modal button */}
					<Button onClick={() => (onClose(), clearCart())}>{t("close")}</Button>
				</div>
			) : (
				// Order error message
				<div>
					<h2 className="text-center text-red-500 text-lg mb-4">
						{t("somethingWrong")}
					</h2>
					<p>{t("tryAgain")}</p>
					{/* Close modal button */}
					<Button onClick={() => onClose()}>{t("close")}</Button>
				</div>
			)
	}
}
