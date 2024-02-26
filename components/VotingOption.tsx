import { getUserId } from '@/utils/auth';
import { Movie, Vote } from '@prisma/client';
import Link from 'next/link';

import { ClientVotingOption } from './ClientVotingOption';
import TestRemovalButton from './TestRemovalButton';
import { prisma } from '@/utils/db';

interface VotingOptionProps {
  votes: Array<Vote>;
  movie: Movie;
  movieEventId: number;
}

export async function VotingOption({
  votes,
  movie,
  movieEventId
}: VotingOptionProps) {
  const { posVotes, neutralVotes, negVotes } = votes
    .map((v) => v.voteType)
    .reduce(
      (acc, el) => {
        switch (el) {
          case 'POSITIVE':
            acc.posVotes++;
            break;
          case 'NEUTRAL':
            acc.neutralVotes++;
            break;
          case 'NEGATIVE':
            acc.negVotes++;
            break;
        }
        return acc;
      },
      { posVotes: 0, neutralVotes: 0, negVotes: 0 }
    );

  const userId = await getUserId();

  const givenVote = votes.find((v) => v.userId === userId);

  const possibleOwnedMovieEvent = await prisma.movieEvent.findFirst({
    where: {
      id: movieEventId,
      userId: userId
    }
  });

  // Should it be possible to remove a movie that has votes? Or other associated data?
  const nofVotes = votes.length;

  const userIsOwner = possibleOwnedMovieEvent != null;
  return (
    <div className="bg-primary-100 dark:bg-dark-primary-100 p-5 space-y-4 text-center rounded relative">
      {userIsOwner && nofVotes <= 0 && (
        <TestRemovalButton
          removalIdType="movieEvent"
          removalId={movieEventId}
        />
      )}

      <h4 className="text-xl underline">
        <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
      </h4>

      <ClientVotingOption
        posVotes={posVotes}
        neutralVotes={neutralVotes}
        negVotes={negVotes}
        givenVote={givenVote}
        movieEventId={movieEventId}
      />
    </div>
  );
}
