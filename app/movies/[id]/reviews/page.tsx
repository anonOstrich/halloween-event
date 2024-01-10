import { prisma } from "@/utils/db";
import { link } from "fs";


export default async function ReviewsPage({ params }: { params: { id: string } }) {
    //TODO: Handle the case where the movie doesn't exist. Might be neater to display something else in that case
    const { id } = params

    //TODO: if there's really a massive number of reviews, not a good idea to load all at once. In our friend group, though... not a concern
    const allReviews = await prisma.review.findMany({
        where: {
            movieId: Number(id)
        }
    })


    if (allReviews.length == 0) {
        return <main><h2>No reviews yet</h2></main>
    }

    // TODO: extract the review component and use it here + on the review summary page
    // TODO: Add more details about the reviews
    // (e.g. average, number of votes, visualization of the distribution, ... )
    return <main>
        <ul>
            {allReviews.map(r => (<li key={r.id}>
                <span>{r.score}</span>
                <p>{r.reviewText}</p>
            </li>))}
        </ul>
    </main>

}