import { Movie } from '@prisma/client';
import Link from 'next/link';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { id, title, year, description } = movie;

  return (
    <Link href={`/movies/${id}`} className="block h-full">
      <article
        className="px-4 py-3  rounded shadow-md transition-all flex gap-6 justify-between items-center h-full bg-primary-100 dark:bg-dark-primary-100
        hover:shadow-lg hover:scale-105 hover:duration-500 prose dark:prose-invert
        "
      >
        <div>
          <h3 className="prose-h3">{title}</h3>
          <h4 className="prose-h4">{year}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </article>
    </Link>
  );
}
