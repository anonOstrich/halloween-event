
import { getUserId } from "@/utils/auth";
import { prisma } from "@/utils/db";
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
        return <div className="rounded-md py-5 px-3 bg-teal-600 flex flex-col gap-4">
            <p>You have not reviewed the movie yet</p>
            <Link href={`/movies/${movieId}/review`} className="block text-center py-3 bg-black shadow-sm transition-colors rounded-sm
            hover:bg-white hover:text-black
            hover:shadow-lg">
                Review?
            </Link>
        </div>
    }

    const {
        reviewText,
        score,
        id
    } = existingReview

    // TODO: 
    return (<div className="rounded-md py-5 px-3 bg-teal-600 flex flex-col gap-4">
        <h3>Your review:</h3>
        {reviewText && (<p className="block bg-gray-300 p-4 font-sans text-md text-gray-700">{reviewText}</p>)}
        <span className="text-lg">
            Score: {score} / 19
        </span>

        <Link href={`/movies/${movieId}/review`} className="block text-center py-3 text-sm bg-teal-700 rounded-md hover:text-teal-700 hover:bg-white hover:border-teal-700 hover:shadow-lg transition-all">Update review</Link>
    </div>)
}