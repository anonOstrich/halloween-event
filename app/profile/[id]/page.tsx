import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { Movie, Review } from "@prisma/client"


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
        }}
    )

    const maxMovie = await prisma.review.findFirst({
        where: {
            userId: user.id,
            score: _max.score!
        },
        include: {
            movie: true
        }}
    )




    return <main className="flex flex-col gap-5 px-5">
        <h3>Here is your profile {user.email}</h3>
        <div className="border-2 border-white px-5 py-2">
            <span>Your stats:</span>
            <ul>
                <li>Reviewed {_count.score} movies</li>
                <li>Average rating (/19): {_avg.score}</li>
                <li>Highest rating: {_max.score} (for {minMovie?.movie.title})</li>
                <li>Lowest rating: {_min.score} (for {maxMovie?.movie.title})</li>
            </ul>
        </div>


        <ul className="border-2 border-white px-5 py-2 flex flex-col gap-3">
            {reviews.map(r => (<li key={r.id}>
                <ReviewComponent movie={r.movie} review={r} />
            </li>))}
        </ul>
    </main>
}

function ReviewComponent({ movie, review }: { movie: Movie, review: Review }) {

    const textReviewEl = (<div>
        <span>Review:</span>
        <p className="bg-gray-800 py-5 px-2">{review.reviewText}</p>
    </div>)
    return <section className="border border-red-600 text-base p-2 flex flex-col gap-1">
        <span className="text-base">{movie.title}</span><br />
        <span>Score: {review.score} / 19</span><br />

        {
            review.reviewText != null && textReviewEl
        }


    </section>
}