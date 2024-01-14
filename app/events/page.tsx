import { prisma } from "@/utils/db"
import { Event } from "@prisma/client"
import Link from "next/link"


export default async function EventsPage() {

    const events = await prisma.event.findMany()
    

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1>Events Page</h1>
            <Link href={'/events/create'}>
            <div className="p-5 bg-slate-400 rounded-md hover:bg-slate-800 border-2 border-transparent hover:border-white ">
                Create New Event
            </div>
            </Link>

            <ul>
                {
                    events.map(e => (<li key={e.id}>
                        <EventListItem event={e}/>
                        </li>))
                }
            </ul>
        </div>
    )
}


async function EventListItem({event} : {event: Event}){

    const date = event.plannedDate

    return <span>
        <Link href={`/events/${event.id}`}
            className="inline-block border-2 border-white rounded-md p-5 transition-all
                hover:bg-white hover:text-black hover:border-cyan-600 hover:border-4
                hover:shadow-lg hover:scale-105 hover:duration-500
            "
        >{event.title} - <span className="inline-block px-3">{event.plannedDate.toLocaleDateString()}</span></Link>
        
        
        </span>
}