import { prisma } from '@/utils/db';
import { Movie } from '@prisma/client';
import Link from 'next/link';

interface FormattedReview {
  createdDate: string;
  updatedDate: string;
  score: number;
  text: null | string;
  reviewer: string;
}

export default async function ReviewSummary(props: { movie: Movie }) {
  const { movie } = props;

  const reviews = await prisma.review.findMany({
    where: {
      movieId: movie.id
    },
    select: {
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true
        }
      },
      reviewText: true,
      score: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (reviews.length == 0) {
    return <p>No reviews</p>;
  }

  const formattedReviews = reviews.map((review) => {
    // TODO: hardcode this for Finnish
    // OR: fix this for the client
    const createdDate = review.createdAt.toLocaleString();
    const updatedDate = review.updatedAt.toLocaleString();
    const score = review.score;
    const text = review.reviewText;
    const reviewer = review.user.email;

    return {
      createdDate,
      updatedDate,
      score,
      text,
      reviewer
    };
  }) as Array<FormattedReview>;

  // Currently not useful if I'm fetching all the reviews in any case,
  // but extending to show only a sections should be easier
  const { _avg, _count } = await prisma.review.aggregate({
    where: {
      movieId: movie.id
    },
    _avg: {
      score: true
    },
    _count: {
      score: true
    }
  });

  const average = _avg.score!;
  const averageFormatted = average.toFixed(2);

  const displayAll = _count.score! <= 4;

  return (
    <section className="px-5 py-5 flex flex-col items-center rounder-lg gap-5 bg-primary-100 dark:bg-dark-primary-100 shadow-md rounded">
      <h2 className="prose dark:prose-invert prose-2xl">Summary of reviews</h2>
      <span className="prose dark:prose-invert prose-lg">
        Average rating: {averageFormatted}
      </span>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(displayAll ? formattedReviews : formattedReviews.slice(0, 4)).map(
          (review) => (
            <li key={review.reviewer}>
              <SingleReviewSummary review={review} />
            </li>
          )
        )}
      </ul>
      {!displayAll && (
        <div>
          <p>
            And {formattedReviews.length - 4} other reviews.{' '}
            <Link href={`/movies/${movie.id}/reviews`} className="">
              Read all
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}

// This might be a good idea to extract, eh?
// Would like interactivity -- is this a good candidate for a client component, then?
//TODO: if a review is "too long", give the option to expand it (on this page)
function SingleReviewSummary({ review }: { review: FormattedReview }) {
  const formattedText =
    review.text == null
      ? ''
      : review.text.length > 153
        ? review.text.substring(0, 150) + '...'
        : review.text;

  return (
    <div className="px-3 py-2 flex flex-col gap-5 border-2 border-bg-300 dark:border-dark-bg-300 rounded">
      <div className="text-lg">
        <span>{review.score} / 19</span>
        {review.text != null && (
          <p className="prose dark:prose-invert prose-sm">{formattedText}</p>
        )}
      </div>
      <div className="text-sm">
        <span>By {review.reviewer}</span> <br />
        <span>{review.createdDate}</span>
      </div>
    </div>
  );
}
