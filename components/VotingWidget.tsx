'use client'
import { VoteType } from "@prisma/client";


interface VotingWidgetProps {
    votes: {
        posVotes: number, neutralVotes: number, negVotes: number
    },
}

export default function VotingWidget(props: VotingWidgetProps) {

    const {
        posVotes, neutralVotes, negVotes
    } = props.votes


    return (<ul className="flex flex-col gap-2 items-center p-4 border-2 border-black rounded-md">
        <li>Positive votes: {posVotes}</li>
        <li>Neutral votes: {neutralVotes}</li>
        <li>Negative votes: {negVotes} </li>
    </ul>)
}