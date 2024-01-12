'use client'

import { voteForEventMovie } from "@/utils/api"
import { VoteType } from "@prisma/client"
import { useState } from "react"


// TODO: This is ugly. Figure out what props are really needed...
interface VoteWidgetProps {
    movieEventId: number,
    label: string,
    nofVotes: number,
    matchesOwnVote: boolean,
    voteType: VoteType,
    updateVoteCount: (type: VoteType, increment: boolean) => void
}
// TODO: the client component needs to include the parent state, so the updates flow freely
export default function VoteWidget({movieEventId, label, nofVotes, matchesOwnVote, voteType, updateVoteCount}: VoteWidgetProps){
    const [isLoading, setIsLoading] = useState(false)
    const matchingVote = matchesOwnVote


    async function postVote() {
        setIsLoading(true)
        try {
            const updatedVote = await voteForEventMovie(movieEventId, voteType)
            updateVoteCount(updatedVote.voteType === 'NONVOTE' ? 'NONVOTE' : voteType
            , updatedVote.voteType !== 'NONVOTE')
        } catch (e) {

        } finally {
            setIsLoading(false)

        }
        
    }

function clickHandler (){
            postVote()
        }


    const buttonsEl = (<><button className={`border-2 border-white px-3  disabled:bg-gray-900 ${matchingVote ? 'bg-green-600' : 'bg-gray-600'}`} onClick={clickHandler}>+</button>
    </>)

    return (<div className="flex flex-col items-center">
    <span className="block">{label}: {nofVotes}</span>
    <div>
        {
            isLoading ? <span>Loading...</span> : buttonsEl
        }
        
    </div> <br /></div>)
}