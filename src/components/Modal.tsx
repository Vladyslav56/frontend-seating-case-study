import * as Dialog from "@radix-ui/react-dialog"
import { Cross1Icon } from "@radix-ui/react-icons"
// import { useState } from "react"
import { LoginContent } from "./LoginContent"
import { CartProcess } from "./CartProcess"
import { useState } from "react"

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	content: "login" | "cart" | null
	eventId: string | null
}

export function Modal({ isOpen, onClose, content, eventId }: ModalProps) {
	const [step, setStep] = useState(1)

	const goToStep = (step: number) => {
		setStep(step)
	}

	const handleClose = () => {
		setStep(1)
		onClose()
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Dialog.Trigger />

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
				<Dialog.Content
					className={`fixed bg-white p-6 inset-y-auto inset-1/3 rounded-lg shadow-md z-50 mx-auto`}
				>
					<Dialog.Title />
					<Dialog.Description />
					<Dialog.Close asChild>
						{step === 4 ? null : (
							<Cross1Icon className="absolute w-5 h-5 top-6 right-6 cursor-pointer" />
						)}
					</Dialog.Close>
					{content === "login" ? (
						<LoginContent onClose={handleClose} />
					) : (
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
