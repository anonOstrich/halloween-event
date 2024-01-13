import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { reviewMovie } from "@/utils/server-actions"
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

    const numericalScores = reviews.map(r => r.score)

    const average = numericalScores.reduce((acc, el) => acc + el, 0) / reviews.length

    const max = numericalScores.reduce((acc, el) => el >= acc ? el : acc, -10)
    const min = numericalScores.reduce((acc, el) => el < acc ? el : acc, 100)


    // TODO: Simplify database queries. Currently: three separate ones during the course of rendering
    const maxReview = reviews.find(r => r.score == max)!
    const maxMovie = maxReview.movie.title
    const minReview = reviews.find(r => r.score == min)!
    const minMovie = minReview.movie.title

    return <main className="flex flex-col gap-5 px-5">
        <h3>Here is your profile {user.email}</h3>
        <div className="border-2 border-white px-5 py-2">
            <span>Your stats:</span>
            <ul>
                <li>Reviewed {numericalScores.length} movies</li>
                <li>Average rating (/19): {average}</li>
                <li>Highest rating: {max} (for {maxMovie})</li>
                <li>Lowest rating: {min} (for {minMovie})</li>
            </ul>
        </div>


        <ul className="border-2 border-white px-5 py-2 flex flex-col gap-3">
            {reviews.map(r => (<li key={r.id}>
                <ReviewComponent movie={r.movie} review={r} />
            </li>))}
        </ul>
    </main>
}

// This time: no need to link to the user. Yes need to link to the movie! So might be a good idea just to fetch the names of the movies during the initial query...
// But this functionality could be passed as props to the review summary component, for sure? Linking the review with user and movie filled out would give sufficient access
function ReviewComponent({ movie, review }: { movie: Movie, review: Review }) {
    return <section className="border border-red-600 text-base p-2 flex flex-col gap-1">
        <span className="text-base">{movie.title}</span><br />
        <span>Score: {review.score} / 19</span><br />
        <div>
            <span>Review:</span>
            <p className="bg-gray-800 py-5 px-2">{review.reviewText}</p>
        </div>

    </section>
}