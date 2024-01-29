import ExperimentalThumbsUpWidget from "@/components/ExperimentalThumbsUpWidget"
import FormRow from "@/components/FormRow"
import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
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

    const defaultScore = possibleExistingReview == null ? 10 : possibleExistingReview.score




    // TODO: this is not the most elegant syntax
    const defaultText = possibleExistingReview == null ? '' : possibleExistingReview.reviewText ?? ''


    return (
        <section>
            <h1 className="text-center prose dark:prose-invert prose-2xl">{movie.title}</h1>
            <form action={handleReviewSubmission} className="form">
                <input type="hidden" name="movie-id" id='movie-id' value={movie.id} />

                <FormRow type="textarea" displayValue="Review text" separateDisplayValue defaultValue={defaultText} name="movie-review-text" />
                <ExperimentalThumbsUpWidget config={{ min: 0, max: 19, label: "Score" }} input={{ score: defaultScore }} />
                <div>

                </div>

                <div className="w-full flex justify-center items-center gap-5">
                    <button type="submit" className="" >{possibleExistingReview == null ? 'Review' : 'Update review'}</button>
                    {
                        possibleExistingReview == null ? (<Link className="block" href={`/movies/${movie.id}`}>Cancel</Link>) : (<form action={handleReviewDeletion}>
                            <input type="hidden" name="movie-id" value={movie.id} />
                            <button type="submit">Delete review
                            </button></form>)
                    }
                </div>
            </form>

        </section>)
}