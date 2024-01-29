import { getUserId } from "@/utils/auth"
import { Movie, Vote } from "@prisma/client"
import VotingWidget from "./VotingWidget"
import Link from "next/link"



interface VotingOptionProps {
    votes: Array<Vote>,
    movie: Movie,
    movieEventId: number
}

export async function VotingOption({ votes, movie, movieEventId }: VotingOptionProps) {

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
    }, { posVotes: 0, neutralVotes: 0, negVotes: 0 })

    const userId = await getUserId()

    const givenVote = votes.find(v => v.userId === userId)


    return <div className="bg-primary-100 dark:bg-dark-primary-100 p-5 space-y-4 text-center rounded">
        <h6 className="text-lg underline"><Link href={`/movies/${movie.id}`}>{movie.title}</Link></h6>
        {
            <VotingWidget
                ownVote={givenVote?.voteType ?? null}
                votes={{ posVotes, neutralVotes, negVotes }}
                movieEventId={movieEventId}
            />
        }

    </div>
}