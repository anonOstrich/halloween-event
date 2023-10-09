'use client'

import { reactToMovie } from "@/utils/api";
import { Reaction as ReactionType } from "@prisma/client";
import { useState } from "react";



export default function Reaction({ reaction, movieId }: { reaction: ReactionType | null, movieId: number }) {
    const [type, setType] = useState(reaction?.type)

    function handlerCreator(reaction: ReactionType['type']) {
        return async function handler() {
            const newReaction = await reactToMovie(movieId, reaction)
            setType(newReaction.type)
        }
    }





    return <div><div className="flex gap-2 items-start">
        <button onClick={handlerCreator('NEGATIVE')} className={`border-2 px-3 hover:bg-red-400 ${type === "NEGATIVE" ? 'bg-red-700' : ''}`}>-</button>
        <button onClick={handlerCreator('NEUTRAL')} className={`border-2 px-3 hover:bg-blue-400 ${type === "NEUTRAL" ? 'bg-blue-700' : ''}`}>.</button>
        <button onClick={handlerCreator('POSITIVE')} className={`border-2 px-3 hover:bg-green-400 ${type === "POSITIVE" ? 'bg-green-700' : ''}`}>+</button>
    </div>
        <p>You have chosen: {type || 'nothing yet'}</p>
    </div>
}