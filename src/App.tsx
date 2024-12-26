import "./App.css"
import Header from "./components/Header"
import Content from "./components/Content"
import Cart from "./components/Cart"
import { CartProvider } from "./components/providers/CartProvider"
import { UserProvider } from "./components/providers/UserProvider"
import { useState } from "react"
import { Modal } from "./components/Modal"

function App() {
	// Is modal open, modal content and event ID states
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalContent, setModalContent] = useState<"login" | "cart" | null>(
		null
	)
	const [eventId, setEventId] = useState<string | null>(null)

	// Open modal function
	const openModal = (content: "login" | "cart") => {
		setModalContent(content)
		setIsModalOpen(true)
	}

	// Close modal function
	const closeModal = () => {
		setModalContent(null)
		setIsModalOpen(false)
	}

	return (
		// User provider
		<UserProvider>
			{/* Cart provider */}
			<CartProvider>
				{/* Page content */}
				<div className="flex flex-col grow">
					{/* Header component */}
					<Header onLoginClick={() => openModal("login")} />
					{/* Content component */}
					<Content setEventId={setEventId} />
					{/* Cart component */}
					<Cart onCartClick={() => openModal("cart")} />
					{/* Modal window */}
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
