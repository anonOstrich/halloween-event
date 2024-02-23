import { getUserId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { Review as ReviewType } from '@prisma/client';
import Link from 'next/link';

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
    return (
      <div className="rounded-md py-5 px-3 flex flex-col gap-4 bg-accent-200 dark:bg-dark-accent-200">
        <p className="prose dark:prose-invert">
          You have not reviewed the movie yet
        </p>
        <Link href={`/movies/${movieId}/review`} className="block btn">
          Review?
        </Link>
      </div>
    );
  }

  const { reviewText, score, id } = existingReview;

  // TODO:
  return (
    <div className="rounded-md py-5 px-3 flex flex-col gap-4 prose dark:prose-invert">
      <h3 className="prose-h3">Your review:</h3>
      {reviewText && (
        <p className="block p-4 prose-blockquote   bg-bg-200  dark:bg-dark-bg-200 border-2 shadow-md">
          {reviewText}
        </p>
      )}
      <span className="prose prose-lg">Score: {score} / 19</span>

      <Link href={`/movies/${movieId}/review`} className="block  btn not-prose">
        Update review
      </Link>
    </div>
  );
}
