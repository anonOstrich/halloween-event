import { prisma } from "@/utils/db";
import { convertScoreToNumber } from "@/utils/score-utils";
import { Movie } from "@prisma/client";
import Link from "next/link";

interface FormattedReview {
    createdDate: string,
    updatedDate: string,
    score: number,
    text: null | string,
    reviewer: string
}

// This sucks: apparrently prisma doesn't allow for using enums as integers as I'd anticipated
// Options: A) run function in DB when adding results, store in own columb
// B) convert in database with each query
// C) conversion on client side
// For now, I'll choose C. But this requires iterating through all the reviews and consequently sending all of them over the database connection. Not the best! :/
export default async function ReviewSummary(props: { movie: Movie }) {
    const { movie } = props

    const reviews = await prisma.review.findMany({
        where: {
            movieId: movie.id
        },
        select: {
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    email: true,
                }
            },
            reviewText: true,
            score: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (reviews.length == 0) {
        return <section className="bg-gray-200 px-5 py-5">
            No reviews
        </section>
    }

    const formattedReviews = reviews.map(review => {
        // TODO: hardcode this for Finnish
        // OR: fix this for the client
        const createdDate = review.createdAt.toLocaleString()
        const updatedDate = review.updatedAt.toLocaleString()
        const score = convertScoreToNumber(review.score)
        const text = review.reviewText
        const reviewer = review.user.email

        return {
            createdDate,
            updatedDate,
            score,
            text,
            reviewer
        }

    }) as Array<FormattedReview>

    const average = (formattedReviews.map(review => review.score).reduce((acc, el) => acc + el, 0) / formattedReviews.length)
    const averageFormatted = average.toFixed(2)

    const displayAll = formattedReviews.length <= 4


    return <section className="bg-gray-200 px-5 py-5 text-black">
        <h2>Reviews summary</h2>
        <span className="text-base">Result of avg: {averageFormatted}</span>
        <ul className="flex flex-col gap-2">
            {
                (displayAll ? formattedReviews : formattedReviews.slice(0, 4)).map(review => (<li key={review.reviewer}><SingleReviewSummary review={review} /></li>))
            }
        </ul>
        {
            !displayAll && <div>
                <p>And {formattedReviews.length - 4} other reviews. <Link href={`/movies/${movie.id}/reviews`}>Read them all</Link></p>
            </div>
        }
        {
            //TODO: REMOVE! only for testing out that this link and page work
            <Link href={`/movies/${movie.id}/reviews`}>Read them all</Link>
        }
    </section>
}

// This might be a good idea to extract, eh?
// Would like interactivity -- is this a good candidate for a client component, then?
//TODO: if a review is "too long", give the option to expand it (on this page)
function SingleReviewSummary({ review }: { review: FormattedReview }) {

    const formattedText = review.text == null ? "" : (
        review.text.length > 153 ? review.text.substring(0, 150) + "..." : review.text
    )

    return <div className="border-2 border-black px-3 py-2 bg-slate-300">
        <div className="text-base">
            <span>{review.score} / 19</span>
            {
                review.text != null && (
                    <p>
                        {formattedText}
                    </p>
                )
            }
        </div>
        <div className="text-sm">
            <span>By {review.reviewer}</span> <br />
            <span>{review.createdDate}</span>
        </div>
    </div>
}