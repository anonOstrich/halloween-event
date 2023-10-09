import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { Reaction as ReactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";




export default async function Reaction({ reaction, movieId }: { reaction: ReactionType | null, movieId: number }) {
    const type = reaction?.type!

    const userId = await getUserId()

    function handleReactionCreator(kind: ReactionType['type']) {
        return async function handleReaction() {
            'use server'
            if (!reaction) {
                await prisma.reaction.create({
                    data: {
                        type: kind,
                        userId: userId,
                        movieId: movieId
                    }
                })
            } else {
                await prisma.reaction.update({
                    where: {
                        movieId: movieId,
                        userId: userId,
                        id: reaction.id
                    },
                    data: {
                        type: kind
                    }
                })
            }

            revalidatePath(`/movies/${movieId}`)
        }
    }


    return <div><form className="flex gap-2 items-start">
        <button formAction={handleReactionCreator('NEGATIVE')} className={`border-2 px-3 hover:bg-red-400 ${type === "NEGATIVE" ? 'bg-red-700' : ''}`}>-</button>
        <button formAction={handleReactionCreator('NEUTRAL')} className={`border-2 px-3 hover:bg-blue-400 ${type === "NEUTRAL" ? 'bg-blue-700' : ''}`}>.</button>
        <button formAction={handleReactionCreator('POSITIVE')} className={`border-2 px-3 hover:bg-green-400 ${type === "POSITIVE" ? 'bg-green-700' : ''}`}>+</button>
    </form>
        <p>You have chosen: {type || 'nothing yet'}</p>
    </div>
}