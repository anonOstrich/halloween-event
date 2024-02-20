import { prisma } from '@/utils/db';
import { EventMovieAdder } from './EventModieAdder';
import { VotingOption } from './VotingOption';
import NewEventMovieAdder from './NewEventMovieAdder';

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

  const initialMovieOptions = await prisma.movie.findMany({
    take: 6
  });

  return (
    <div>
      <h2>The movies you can vote for</h2>
      <ul className="space-y-2">
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

      <NewEventMovieAdder
        eventId={eventId}
        initialMovieOptions={initialMovieOptions}
      />

      <EventMovieAdder
        eventId={eventId}
        initialMovieOptions={initialMovieOptions}
      />
    </div>
  );
}
