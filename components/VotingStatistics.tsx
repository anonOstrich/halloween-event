'use client'
// N.B. This has some performance impact
// https://tailwindcss.com/docs/configuration#referencing-in-java-script
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'
import { BarGraph } from "./BarGraph";
import { useDarkThemeIsPreferred } from '@/utils/hooks';

const fullConfig = resolveConfig(tailwindConfig)



interface VotingStatisticsProps {
    votes: {
        posVotes: number, neutralVotes: number, negVotes: number
    },
}

export default function VotingStatistics(props: VotingStatisticsProps) {
    const darkThemeIsPreferred = useDarkThemeIsPreferred()



    const {
        posVotes, neutralVotes, negVotes
    } = props.votes


    const totalVotes = posVotes + neutralVotes + negVotes;
    if (totalVotes === 0) {
        return (<div className="flex flex-col gap-2 items-center p-4 border-2 border-black rounded-md">No votes yet</div>)
    }

    const mean = (posVotes - negVotes) / totalVotes;
    const meanWidened = mean * 100;
    const meanRounded = meanWidened.toFixed(2);


    //@ts-ignore
    const posColor = fullConfig.theme?.colors[darkThemeIsPreferred ? "dark-success" : "success"]
    //@ts-ignore
    const negColor = fullConfig.theme?.colors[darkThemeIsPreferred ? "dark-danger" : "danger"]
    //@ts-ignore
    const neutralColor = fullConfig.theme?.colors[darkThemeIsPreferred ? "dark-primary-200" : "primary-200"]


    return (
        <div className="flex flex-col md:flex-row sm:gap-2 md:gap-4 lg:gap-16 items-start md:items-center ">
            <h3 className='prose prose-2xl dark:prose-invert'>Positivity: {meanRounded}</h3>
            <div className='w-full flex flex-col align-center justify-center'>
                <div className="h-8 w-full min-w-[100px] mx-auto">
                    <BarGraph data={[{
                        value: posVotes, label: "Positive", color: posColor?.toString()!
                    }, {
                        value: neutralVotes, label: "Neutral", color: neutralColor?.toString()!
                    }, {
                        value: negVotes, label: "Negative", color: negColor?.toString()!
                    }]} />
                </div>
                <h3 className='prose prose-xl dark:prose-invert'>Total votes: {totalVotes}</h3>

            </div>


        </div>)
}

