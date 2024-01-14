import { EventMovieAdder } from "@/components/EventModieAdder"
import VoteWidget from "@/components/VoteWidget"
import VotingWidget from "@/components/VotingWidget"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { associateMoviesWithEvent } from "@/utils/server-actions"
import { Event, Movie, MovieEvent, Vote } from "@prisma/client"
import Link from "next/link"
import { redirect } from "next/navigation"


async function handleMovieAdding(data: FormData) {
    'use server'
    console.log(`data: `, data)

    const movieIds = data.getAll('movie-id').map(id => Number(id))
    const eventId = Number(data.get('event-id')!)
    const succesfulWrites = await associateMoviesWithEvent(eventId, movieIds)
    redirect(`/events/${eventId}`)
}


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

async function EventMovies({eventId}: {eventId: number}) {
    const voteOptions = await prisma.movieEvent.findMany({
        where: {
            eventId: eventId
        },
        select: {
            id: true,
            movie: true,
            votes: true
        }
    })

    const initialMovieOptions = await prisma.movie.findMany({
        take: 2
    })


    return        (<div>
    <h2>The movies you can vote for</h2>
    <ul>
        {
            voteOptions.map(voteOption => (<li key={voteOption.id}>
                <VoteOption movieEventId={voteOption.id} votes={voteOption.votes} movie={voteOption.movie}/>
            </li>))
        }
    </ul>


    <EventMovieAdder eventId={eventId} initialMovieOptions={initialMovieOptions} />

</div>)
}

interface VoteOptionProps {
    votes: Array<Vote>,
    movie: Movie,
    movieEventId: number
}



async function VoteOption({votes, movie, movieEventId}: VoteOptionProps) {

    const {
        posVotes,
        neutralVotes,
        negVotes
    } = votes.map(v => v.voteType).reduce((acc, el) => {
        switch (el) {
            case "POSITIVE":
                acc.posVotes++
                break
            case "NEUTRAL":
                acc.neutralVotes++
                break
            case "NEGATIVE":
                acc.negVotes++
                break
        }
        return acc
    }, {posVotes: 0, neutralVotes: 0, negVotes:0})

    const userId = await getUserId()

    const givenVote = votes.find(v => v.userId === userId)
    

    return <div className="border-2 border-white p-5">
        <h6><Link href={`/movies/${movie.id}`} className="underline">{movie.title}</Link></h6>
        {
            <VotingWidget
            ownVote={givenVote?.voteType ?? null}
            votes={{posVotes, neutralVotes, negVotes}}
            movieEventId={movieEventId}
            />
        }
        
    </div>
}

