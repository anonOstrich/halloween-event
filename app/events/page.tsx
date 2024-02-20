import { EventCard } from '@/components/EventCard';
import { prisma } from '@/utils/db';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await prisma.event.findMany();

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="prose dark:prose-invert prose-2xl">Events</h1>

      <ul className="flex flex-col gap-4 items-stretch">
        {events.map((e) => (
          <li key={e.id}>
            <EventCard event={e} />
          </li>
        ))}
      </ul>

      <Link href={'/events/create'}>
        <button className="btn">Create New Event</button>
      </Link>
    </div>
  );
}
