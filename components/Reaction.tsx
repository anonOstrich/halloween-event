
import { getMovieReaction, reactToMovie } from "@/utils/api";
import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { Review as ReviewType } from "@prisma/client";



export default async function Review({ movieId }: { movieId: number }) {
    const userId = await getUserId();
    const existingReview = await prisma.review.findFirst({
        where: {
        movieId: movieId,
        userId: userId
        }
    });

    if (existingReview == null ) {
        return <h2>You have not reviewed the movie yet</h2>
    }

    return <h2>You have reviewed the movie :)</h2>
}