import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { Movie, Review } from "@prisma/client"
import Link from "next/link"


export default async function ProfilePage() {
    const userId = await getUserId()

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (user == null) {
        return <h2>No such user exists</h2>
    }

    const reviews = await prisma.review.findMany({
        where: {
            userId: user.id
        },
        include: {
            // If need only some properties, nest a select statement
            movie: true
        }
    })

    if (reviews.length == 0) {
        return <main><h2>No reviews yet!</h2></main>
    }




    // At the moment this would be better done on client side (if I'm going to fetch and present ALL the reviews from the user on a single page)
    // For future, definitely worth the effort
    const aggregateStats = await prisma.review.aggregate({
        where: {
            userId: user.id
        },
        _avg: {
            score: true
        },
        _min: {
            score: true
        },
        _max: {
            score: true,
        },
        _count: {
            score: true
        }
    })

    const {
        _avg,
        _min,
        _max,
        _count
    } = aggregateStats

    const minMovie = await prisma.review.findFirst({
        where: {
            userId: user.id,
            score: _min.score!
        },
        include: {
            movie: true
        }
    }
    )

    const maxMovie = await prisma.review.findFirst({
        where: {
            userId: user.id,
            score: _max.score!
        },
        include: {
            movie: true
        }
    }
    )




    return <div className="flex flex-col gap-5 px-5 items-stretch">
        <h1 className="text-4xl">Here is your profile, {user.email}</h1>
        <div className="px-5 py-2  rounded-md text-lg">
            <h2 className="text-2xl">Your stats:</h2>
            <ul className="mt-4">
                <li>Reviewed {_count.score} movies</li>
                <li>Average rating (/19): {_avg.score}</li>
                <li>Highest rating: {_max.score} (for <Link href={`/movies/${minMovie?.id}`}>{minMovie?.movie.title}</Link>)</li>
                <li>Lowest rating: {_min.score} (for <Link href={`/movies/${maxMovie?.id}`}>{maxMovie?.movie.title}</Link>)</li>
            </ul>
        </div>


        <div className="flex flex-col items-center  rounded-md">
            <h2 className="prose dark:prose-invert prose-2xl">Your reviews:</h2>
            <ul className=" px-5 py-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 items-stretch">
                {reviews.map(r => (<li key={r.id} className="">
                    <ReviewComponent movie={r.movie} review={r} />
                </li>))}
            </ul>
        </div>
    </div>
}

function ReviewComponent({ movie, review }: { movie: Movie, review: Review }) {

    const textReviewEl = (<div className="flex flex-col gap-1 mt-2">
        <span>Review text:</span>
        <p className="py-2 px-4 rounded prose dark:prose-invert prose-sm bg-bg-100/20 dark:bg-dark-bg-100/20">{review.reviewText}</p>
    </div>)

    return <section className="text-base py-2 px-5 flex flex-col gap-1  rounded-md h-full bg-primary-100 dark:bg-dark-primary-100">
        <h2 className="text-2xl">{movie.title}</h2>
        <span>Score: {review.score} / 19</span>

        {
            review.reviewText != null && review.reviewText.trim().length > 0 && textReviewEl
        }


    </section>
}