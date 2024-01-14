import { getUserId } from "@/utils/auth"
import { Movie, Vote } from "@prisma/client"
import VotingWidget from "./VotingWidget"
import Link from "next/link"


 
interface VotingOptionProps {
    votes: Array<Vote>,
    movie: Movie,
    movieEventId: number
}

export async function VotingOption({votes, movie, movieEventId}: VotingOptionProps) {

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