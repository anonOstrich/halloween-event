'use client'
import { VoteType } from "@prisma/client";
import VoteWidget from "./VoteWidget";
import { useState } from "react";


interface VotingWidgetProps {
    votes: {
        posVotes: number, neutralVotes: number, negVotes: number
    },
    ownVote: VoteType | null,
    movieEventId: number
}

export default function VotingWidget(props: VotingWidgetProps) {

    const [posVotes, setPosVotes] = useState(props.votes.posVotes)
    const [neutralVotes, setNeutralVotes] = useState(props.votes.neutralVotes)
    const [negVotes, setNegVotes] = useState(props.votes.negVotes)
    const [ownVote, setOwnVote] = useState(props.ownVote)


    function updateVoteCount(type: VoteType, increment: boolean) {

        const functionToCall = ownVote === 'POSITIVE' ? setPosVotes : ownVote === 'NEUTRAL' ? setNeutralVotes : ownVote === 'NEGATIVE' ? setNegVotes : () => { }

        switch (type) {
            case 'POSITIVE':
                setPosVotes(prev => increment ? prev + 1 : prev - 1)
                if (ownVote != null && ownVote !== 'NONVOTE' && ownVote !== 'POSITIVE') {
                    functionToCall(prev => prev - 1)
                }
                break
            case 'NEUTRAL':
                setNeutralVotes(prev => increment ? prev + 1 : prev - 1)
                if (ownVote != null && ownVote !== 'NONVOTE' && ownVote !== 'NEUTRAL') {
                    functionToCall(prev => prev - 1)
                }
                break
            case 'NEGATIVE':
                setNegVotes(prev => increment ? prev + 1 : prev - 1)
                if (ownVote != null && ownVote !== 'NONVOTE' && ownVote !== 'NEGATIVE') {
                    functionToCall(prev => prev - 1)
                }
                break
            case 'NONVOTE':
                functionToCall(prev => prev - 1)
                break
        }


        setOwnVote(type)
    }


    const movieEventId = props.movieEventId


    return (<div className="flex gap-5 items-center">
        <VoteWidget movieEventId={movieEventId} label="Positive" nofVotes={posVotes} matchesOwnVote={ownVote === 'POSITIVE'} voteType="POSITIVE" updateVoteCount={updateVoteCount} />
        <VoteWidget movieEventId={movieEventId} label="Neutral" nofVotes={neutralVotes} matchesOwnVote={ownVote === 'NEUTRAL'} voteType="NEUTRAL" updateVoteCount={updateVoteCount} />
        <VoteWidget movieEventId={movieEventId} label="Negative" nofVotes={negVotes} matchesOwnVote={ownVote === 'NEGATIVE'} voteType="NEGATIVE" updateVoteCount={updateVoteCount} />
    </div>)
}