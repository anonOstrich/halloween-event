import { EventCard } from "@/components/EventCard"
import { prisma } from "@/utils/db"
import Link from "next/link"


export default async function EventsPage() {

    const events = await prisma.event.findMany()


    return (
        <div className="flex flex-col items-center gap-2">
            <h1>Events Page</h1>
            <Link href={'/events/create'}>
                <div className="p-5 bg-slate-400 rounded-md hover:bg-slate-800 border-2 border-transparent hover:border-white ">
                    Create New Event
                </div>
            </Link>

            <ul className="flex flex-col gap-4 items-stretch">
                {
                    events.map(e => (<li key={e.id}>
                        <EventCard event={e} />
                    </li>))
                }
            </ul>
        </div>
    )
}


