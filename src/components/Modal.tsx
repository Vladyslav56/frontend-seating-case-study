import * as Dialog from "@radix-ui/react-dialog"
import { Cross1Icon } from "@radix-ui/react-icons"
// import { useState } from "react"
import { LoginContent } from "./LoginContent"
import { CartProcess } from "./CartProcess"
import { useState } from "react"

// Props interface
interface ModalProps {
	isOpen: boolean
	onClose: () => void
	content: "login" | "cart" | null
	eventId: string | null
}

export function Modal({ isOpen, onClose, content, eventId }: ModalProps) {
	// State for modal steps
	const [step, setStep] = useState(1)

	// Change steps function
	const goToStep = (step: number) => {
		setStep(step)
	}

	// Close modal function
	const handleClose = () => {
		setStep(1)
		onClose()
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Dialog.Trigger />

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
				{/* Inner content */}
				<Dialog.Content
					className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-4/5 md:w-3/5 xl:w-1/3 p-6  rounded-lg shadow-md z-50 mx-auto`}
				>
					<Dialog.Title />
					<Dialog.Description />
					{/* Close modal button */}
					<Dialog.Close asChild>
						{step === 4 ? null : (
							<Cross1Icon className="absolute w-5 h-5 top-6 right-6 cursor-pointer" />
						)}
					</Dialog.Close>
					{content === "login" ? (
						// Login form
						<LoginContent onClose={handleClose} />
					) : (
						// Cart process steps
						<CartProcess
							step={step}
							onClose={handleClose}
							goToStep={goToStep}
							eventId={eventId}
						/>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
