'use client'
interface VoteWidgetProps {
    label: string,
    nofVotes: number,
    matchesOwnVote: boolean
}

export default function VoteWidget({label, nofVotes, matchesOwnVote}: VoteWidgetProps){

    function handleClickCreator(plus: boolean) {
        return function clickHandler (){
            console.log('Handling click with the parameter: ', plus)

        }
    }

    return (<>
    <span>{label}: {nofVotes}</span>
    <div>
        <button className="border-2 border-white px-3 bg-green-600 disabled:bg-gray-900" disabled={matchesOwnVote} onClick={handleClickCreator(true)}>+</button>
        <button className="border-2 border-white px-2 bg-red-600 disabled:bg-gray-900" disabled={!matchesOwnVote} onClick={handleClickCreator(false)}>-</button>
    </div> <br /></>)
}