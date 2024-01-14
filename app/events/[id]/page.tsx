import { EventMovieAdder } from "@/components/EventModieAdder"
import { EventMovies } from "@/components/EventMovies"
import VotingWidget from "@/components/VotingWidget"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { Movie, Vote } from "@prisma/client"
import Link from "next/link"



export default async function EventPage({params}: {params: {id: string}}) {
    const { id } = params

    const event = await prisma.event.findFirst({
        where: {
            id: Number(id)
        }
    })

    if (event == null) {
        return <h4 className="text-red-700">No event with such id exists</h4>
    }

    const isPakotus = event.movieClubEvent


    return <main className="flex flex-col justify-center items-center gap-3">
        <h1>Event Page</h1>
        <h2>{event.title} {isPakotus && (<span className="uppercase text-amber-200">pakotus</span>)}</h2>
        <h3>Theme: {event.theme}</h3>
        <div>
            <h4 className="text-center">Description</h4>
            <p>
                { event.description }
            </p>
        </div>

        <EventMovies eventId={event.id} />

    </main>

}









