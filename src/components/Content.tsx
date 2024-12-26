import { useEffect, useState } from "react"
import { Seat } from "./Seat"
import { Button } from "./ui/button"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface Event {
	eventId: string
	namePub: string
	description: string
	currencyIso: string
	dateFrom: string
	dateTo: string
	headerImageUrl: string
	place: string
}

interface TicketType {
	id: string
	name: string
	price: number
}

interface Seat {
	seatId: string
	place: number
	ticketTypeId: string
}

interface SeatRow {
	seatRow: number
	seats: Seat[]
}

interface TicketData {
	ticketTypes: TicketType[]
	seatRows: SeatRow[]
}

interface ContentProps {
	setEventId: (eventId: string) => void
}

function Content({ setEventId }: ContentProps) {
	const { t } = useTranslation()
	const [event, setEvent] = useState<Event | null>(null)
	const [tickets, setTickets] = useState<TicketData | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const resEvent = await axios.get<Event>(`${BASE_URL}/event`)
				setEvent(resEvent.data)
				setEventId(resEvent.data.eventId)

				const resTickets = await axios.get<TicketData>(
					`${BASE_URL}/event-tickets?eventId=${resEvent.data.eventId}`
				)
				setTickets(resTickets.data)
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	const maxSeat = Math.max(
		...(tickets?.seatRows.flatMap((row) =>
			row.seats.map((seat) => seat.place)
		) || [])
	)

	const rowRender = (row: SeatRow) => {
		const seats = []

		for (let i = 1; i <= maxSeat; i++) {
			const seatData = row.seats.find((s) => s.place === i)
			const ticketType = tickets?.ticketTypes.find(
				(type) => type.id === seatData?.ticketTypeId
			)
			seats.push(
				<Seat
					key={i}
					seatId={seatData?.seatId}
					row={row.seatRow}
					place={i}
					ticketType={ticketType?.name}
					ticketTypeId={ticketType?.id}
					price={ticketType?.price}
					occupied={!seatData}
				/>
			)
		}

		return (
			<div key={row.seatRow} className="flex gap-2 min-w-max">
				{seats}
			</div>
		)
	}

	const handleAddToGoogleCalendar = () => {
		if (event) {
			const params = new URLSearchParams({
				action: "TEMPLATE",
				text: event.namePub,
				dates: `${event.dateFrom.replace(
					/-|:|\.\d+/g,
					""
				)}/${event.dateTo.replace(/-|:|\.\d+/g, "")}`,
				details: event.description,
				location: event.place,
				sf: "true",
				output: "xml",
			})

			const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`

			window.open(calendarUrl, "_blank", "noopener, noreferrer")
		}
	}

	return (
		<main className="grow flex flex-col justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full flex-col-reverse md:flex-row">
				{/* seating card */}
				<div
					className={`bg-white rounded-md grow flex flex-col gap-2 p-3 self-stretch shadow-sm overflow-x-auto ${
						maxSeat > 8 ? "items-start lg:items-center" : "items-center"
					}`}
				>
					{/*	seating map */}
					{isLoading ? (
						<p className="text-center">{t("loading")}</p>
					) : (
						tickets && tickets.seatRows.map((row) => rowRender(row))
					)}
				</div>

				{/* event info */}
				<aside className="w-full md:max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
					{/* event header image placeholder */}
					<div className="bg-zinc-100 rounded-md h-36 overflow-hidden">
						<img
							src={event?.headerImageUrl}
							alt="event image"
							className="object-cover object-bottom w-full h-full"
						/>
					</div>
					{/* event name */}
					<h1 className="text-xl text-zinc-900 font-semibold">
						{event?.namePub}
					</h1>
					{/* event description */}
					<p className="text-sm text-zinc-500">
						<span className="text-zinc-900 font-semibold">
							{t("description")}:
						</span>{" "}
						{event?.description}
					</p>
					<p className="text-sm text-zinc-500">
						<span className="text-zinc-900 font-semibold">{t("date")}:</span>{" "}
						{event?.dateFrom && new Date(event.dateFrom).toLocaleDateString()}
					</p>
					<p className="text-sm text-zinc-500">
						<span className="text-zinc-900 font-semibold">{t("time")}:</span>{" "}
						{t("from")}{" "}
						{event?.dateFrom &&
							new Date(event.dateFrom).toLocaleTimeString("cz-CZ", {
								hour: "numeric",
								minute: "numeric",
							})}{" "}
						{t("to")}{" "}
						{event?.dateTo &&
							new Date(event.dateTo).toLocaleTimeString("cz-CZ", {
								hour: "numeric",
								minute: "numeric",
							})}
					</p>
					<p className="text-sm text-zinc-500">
						{" "}
						<span className="text-zinc-900 font-semibold">
							{t("place")}:
						</span>{" "}
						{event?.place}
					</p>

					{/* add to calendar button */}
					<Button variant="secondary" onClick={handleAddToGoogleCalendar}>
						{t("addToCalendar")}
					</Button>
				</aside>
			</div>
		</main>
	)
}

export default Content
