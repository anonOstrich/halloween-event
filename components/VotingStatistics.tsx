'use client'

import { BarGraph } from "./BarGraph";


interface VotingStatisticsProps {
    votes: {
        posVotes: number, neutralVotes: number, negVotes: number
    },
}

export default function VotingStatistics(props: VotingStatisticsProps) {

    const {
        posVotes, neutralVotes, negVotes
    } = props.votes


    const totalVotes = posVotes + neutralVotes + negVotes;
    if (totalVotes === 0) {
        return (<div className="flex flex-col gap-2 items-center p-4 border-2 border-black rounded-md">No votes yet</div>)
    }

    const mean = (posVotes - negVotes) / totalVotes;
    const meanRounded = mean.toFixed(2);


    return (
        <div>
            <p>Mean: {meanRounded}</p>
            <p>Total votes: {totalVotes}</p>
            <div className="w-full h-8">
                <BarGraph data={[{
                    value: posVotes, label: "Positive", color: "green"
                }, {
                    value: neutralVotes, label: "Neutral", color: "yellow"
                }, {
                    value: negVotes, label: "Negative", color: "red"
                }]} />
            </div>

        </div>)
}

