
import { getMovieReaction, reactToMovie } from "@/utils/api";
import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { convertScoreToNumber } from "@/utils/score-utils";
import { Review as ReviewType } from "@prisma/client";
import Link from "next/link";



export default async function Review({ movieId }: { movieId: number }) {
    const userId = await getUserId();
    const existingReview = await prisma.review.findFirst({
        where: {
            movieId: movieId,
            userId: userId
        }
    });


    if (existingReview == null) {
        // TODO: Review on this site? Or give a rating?
        return <div>
            <p>You have not reviewed the movie yet</p>
            <Link href={`/movies/${movieId}/review`}>Review?</Link>
        </div>
    }

    const {
        reviewText,
        score,
        id
    } = existingReview

    // TODO: 
    return (<div>
        <h3>Your review:</h3>
        {reviewText && (<p>{reviewText}</p>)}
        <h4>{convertScoreToNumber(score)} / 19</h4>
        <Link href={`/movies/${movieId}/review`}>Update review</Link>
    </div>)
}