import "./App.css"
import Header from "./components/Header"
import Content from "./components/Content"
import Cart from "./components/Cart"
import { CartProvider } from "./components/providers/CartProvider"
import { UserProvider } from "./components/providers/UserProvider"
import { useState } from "react"
import { Modal } from "./components/Modal"

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalContent, setModalContent] = useState<"login" | "cart" | null>(
		null
	)
	const [eventId, setEventId] = useState<string | null>(null)

	const openModal = (content: "login" | "cart") => {
		setModalContent(content)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setModalContent(null)
		setIsModalOpen(false)
	}

	return (
		<UserProvider>
			<CartProvider>
				<div className="flex flex-col grow">
					<Header onLoginClick={() => openModal("login")} />
					<Content setEventId={setEventId} />
					{/* bottom cart affix (wrapper) */}
					<Cart onCartClick={() => openModal("cart")} />
					<Modal
						isOpen={isModalOpen}
						onClose={closeModal}
						content={modalContent}
						eventId={eventId}
					/>
				</div>
			</CartProvider>
		</UserProvider>
	)
}

export default App
