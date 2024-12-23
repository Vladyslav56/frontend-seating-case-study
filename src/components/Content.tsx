import { useEffect, useState } from "react"
import { Seat } from "./Seat"
import { Button } from "./ui/button"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"

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

function Content() {
	const [event, setEvent] = useState<Event | null>(null)
	const [tickets, setTickets] = useState<TicketData | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const resEvent = await axios.get<Event>(`${BASE_URL}/event`)
				setEvent(resEvent.data)
				console.log(event)

				if (resEvent.data) {
					const resTickets = await axios.get<TicketData>(
						`${BASE_URL}/event-tickets?eventId=${resEvent.data.eventId}`
					)
					setTickets(resTickets.data)
					console.log(tickets)
				}
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	console.log(tickets)

	const rowRender = (row: SeatRow) => {
		const maxSeat = Math.max(
			...(tickets?.seatRows.flatMap((row) =>
				row.seats.map((seat) => seat.place)
			) || [])
		)
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
					price={ticketType?.price}
					occupied={!seatData}
				/>
			)
		}

		return <div className="flex justify-center gap-2">{seats}</div>
	}

	return (
		<main className="grow flex flex-col justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
				{/* seating card */}
				<div className="bg-white rounded-md grow flex flex-col gap-2 p-3 self-stretch shadow-sm">
					{/*	seating map */}
					{/* {Array.from({ length: 100 }, (_, i) => (
						<Seat key={i} />
					))} */}
					{/* {tickets &&
						tickets.seatRows.map((row) =>
							row.seats.map((seat) => <Seat key={seat.seatId} />)
						)} */}
					{isLoading ? (
						<p>Loading</p>
					) : (
						tickets && tickets.seatRows.map((row) => rowRender(row))
					)}
				</div>

				{/* event info */}
				<aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
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
						Description: {event?.description}
					</p>
					<p className="text-sm text-zinc-500">
						Date:{" "}
						{event?.dateFrom && new Date(event.dateFrom).toLocaleDateString()}
					</p>
					<p className="text-sm text-zinc-500">
						Time: from{" "}
						{event?.dateFrom &&
							new Date(event.dateFrom).toLocaleTimeString("cz-CZ", {
								hour: "numeric",
								minute: "numeric",
							})}{" "}
						to{" "}
						{event?.dateTo &&
							new Date(event.dateTo).toLocaleTimeString("cz-CZ", {
								hour: "numeric",
								minute: "numeric",
							})}
					</p>
					<p className="text-sm text-zinc-500">Place: {event?.place}</p>

					{/* add to calendar button */}
					<Button variant="secondary" disabled>
						Add to calendar
					</Button>
				</aside>
			</div>
		</main>
	)
}

export default Content
