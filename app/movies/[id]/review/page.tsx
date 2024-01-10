import FormRow from "@/components/FormRow"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { convertScoreToNumber } from "@/utils/score-utils"
import { deleteMovieReview, reviewMovie } from "@/utils/server-actions"
import Link from "next/link"
import { redirect } from "next/navigation"


async function handleReviewSubmission(data: FormData) {
    'use server'
    const reviewScore = Number(data.get('movie-score'))
    const reviewText = data.get('movie-review-text')?.toString()
    const movieId = Number(data.get('movie-id'))




    const updatedReview = await reviewMovie(movieId, reviewScore, reviewText ?? null)

    return redirect(`/movies/${movieId}`)
}

async function handleReviewDeletion(data: FormData) {
    'use server'
    const movieId = Number(data.get('movie-id'))

    const deletedReview = await deleteMovieReview(movieId)
    console.log('DELETED THE FOLLOWING MOVIE REVIEW: ', deletedReview)
    return redirect(`/movies/${movieId}`)

}

export default async function ReviewPage({ params }: { params: { id: string } }) {


    const movieId = Number(params.id)


    const movie = await prisma.movie.findFirst({
        where: {
            id: movieId
        }
    })

    if (movie == null) {
        return <h2>The movie doesn&#39t exist</h2>
    }

    const userId = await getUserId()
    const possibleExistingReview = await prisma.review.findFirst({
        where: {
            movieId: movie.id,
            userId: userId
        }
    })

    console.log('EXISTING REVIEW: ', possibleExistingReview)
    const defaultScore = possibleExistingReview == null ? 10 : convertScoreToNumber(possibleExistingReview.score)

    // TODO: this is not the most elegant syntax
    const defaultText = possibleExistingReview == null ? '' : possibleExistingReview.reviewText ?? ''


    return (
        <section>
            <h2>{movie.title}</h2>
            <form action={handleReviewSubmission}>
                <input type="hidden" name="movie-id" id='movie-id' value={movie.id} />

                <FormRow type="number" displayValue="Score (0-19)" separateDisplayValue value={defaultScore} name="movie-score" />
                <FormRow type="textarea" displayValue="Review text" separateDisplayValue value={defaultText} name="movie-review-text" />
                <button type="submit">{possibleExistingReview == null ? 'Review' : 'Update review'}</button>
            </form>
            {
                possibleExistingReview == null ? (<Link href={`/movies/${movie.id}`}>Cancel</Link>) : (<form action={handleReviewDeletion}>
                    <input type="hidden" name="movie-id" value={movie.id} />
                    <button type="submit">Delete review
                    </button></form>)
            }
        </section>)
}