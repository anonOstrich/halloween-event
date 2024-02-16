import { EventMovieAdder } from "@/components/EventModieAdder"
import { EventMovies } from "@/components/EventMovies"
import VotingStatistics from "@/components/VotingStatistics"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { Movie, Vote } from "@prisma/client"
import Link from "next/link"



export default async function EventPage({ params }: { params: { id: string } }) {
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


    return <main className="justify-center items-start gap-3 space-y-4">
        <h1 className="prose dark:prose-invert prose-2xl text-center">{event.title} {isPakotus && (<span className="uppercase">pakotus</span>)}</h1>
        <h2 className="prose dark:prose-invert prose-xl">Theme: {event.theme}</h2>
        <div>
            <h4>Description</h4>
            <p>
                {event.description}
            </p>
        </div>

        <EventMovies eventId={event.id} />

    </main>

}









