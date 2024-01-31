

type Direction = "row" | "column"



export default function NewVotingWidget({ }) {
    const hasVoted = false
    const direction = "row"

    return <div className="group
    h-full w-full 
    flex items-stretch justify-center
    
    ">
        <div className="w-[33.333%] border-dashed border-2 border-black flex items-center justify-center hover:items-stretch hover:cursor-pointer hover:w-full hover:shadow-md
        bg-gray-500 bg-opacity-100 hover:bg-opacity-0 transition-all ">
            {
                hasVoted ? <span className="text-sm block">Voted</span> : <span className="text-sm block group-hover:hidden ">Vote</span>
            }
            <div className="hidden group-hover:block bg-red-500 group-hover:w-full">
                <ul className="flex bg-blue-500 group-hover:w-full group-hover:h-full items-stretch justify-between divide-x-4">
                    <li className="w-[33%]"><VoteSymbol /></li>
                    <li className="w-[33%]"><VoteSymbol /></li>
                    <li className="w-[33%]"><VoteSymbol /></li>
                </ul>
            </div>
        </div>
    </div>

}

function VoteSymbol() {
    return <div className="h-full w-full flex justify-center items-center">
        +1
    </div>
}