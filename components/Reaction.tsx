'use client'

import { getMovieReaction, reactToMovie } from "@/utils/api";
import { Reaction as ReactionType } from "@prisma/client";
import { useEffect, useState } from "react";



export default function Reaction({ movieId }: { movieId: number }) {
    const [type, setType] = useState<ReactionType['type']>()
    useEffect(() => {
        async function doStuff() {
            const reaction = await getMovieReaction(movieId)
            setType(reaction.type)
        }
        doStuff()
    }, [])

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