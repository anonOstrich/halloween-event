import { prisma } from '@/utils/db';
import { VotingOption } from './VotingOption';
import EventMovieAdder from './EventMovieAdder';

export async function EventMovies({ eventId }: { eventId: number }) {
  const voteOptions = await prisma.movieEvent.findMany({
    where: {
      eventId: eventId
    },
    select: {
      id: true,
      movie: true,
      votes: true
    }
  });

  return (
    <div>
      <h2 className="prose dark:prose-invert prose-2xl mb-4 text-center">
        The movies you can vote for
      </h2>
      <ul
        className="grid 
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      gap-2
      "
      >
        {voteOptions.map((voteOption) => (
          <li key={voteOption.id}>
            <VotingOption
              movieEventId={voteOption.id}
              votes={voteOption.votes}
              movie={voteOption.movie}
            />
          </li>
        ))}
      </ul>

      <EventMovieAdder eventId={eventId} />
    </div>
  );
}
