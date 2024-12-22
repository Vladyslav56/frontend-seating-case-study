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

function Content() {
	const [event, setEvent] = useState<Event | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get<Event>(`${BASE_URL}/event`)
				setEvent(res.data)
				console.log(event)
			} catch (err) {
				console.error(err)
			}
		}
		fetchData()
	}, [])

	return (
		<main className="grow flex flex-col justify-center">
			{/* inner content */}
			<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
				{/* seating card */}
				<div
					className="bg-white rounded-md grow grid p-3 self-stretch shadow-sm"
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
						gridAutoRows: "40px",
					}}
				>
					{/*	seating map */}
					{Array.from({ length: 100 }, (_, i) => (
						<Seat key={i} />
					))}
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
						{event?.dateFrom && new Date(event.dateFrom).toLocaleTimeString()}{" "}
						to {event?.dateTo && new Date(event.dateTo).toLocaleTimeString()}
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
