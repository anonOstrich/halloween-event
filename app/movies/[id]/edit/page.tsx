import FormRow from '@/components/FormRow';
import { getUserId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { updateMovie } from '@/utils/server-actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

//TODO: can you toast from the server...? Probably not - unless you start on the initial page load after the redirect?
async function serverHandleMovieEditSubmit(data: FormData) {
  'use server';
  const id = Number(data.get('movie-id'));
  const title = data.get('movie-title')?.toString();
  const year = Number(data.get('movie-year'));
  const description = data.get('movie-description')?.toString();

  if (title == null || description == null) {
    console.error(`Title or description of the update is nullish`);
    return redirect(`/movies/${id}`);
  }

  const updatedMovie = await updateMovie(id, title, year, description);

  return redirect(`/movies/${id}`);
}

export default async function MovieEditPage({
  params
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const userId = await getUserId();

  // TODO: Same level of authorization for deleting movies as well
  // Already some authorization!
  const movie = await prisma.movie.findFirstOrThrow({
    where: {
      id: id,
      userId: userId
    }
  });

  return (
    <main>
      <h1 className="prose dark:prose-invert prose-2xl">{movie.title}</h1>

      <form
        action={serverHandleMovieEditSubmit}
        className="form prose dark:prose-invert"
      >
        <input type="hidden" name="movie-id" value={movie.id} />

        <FormRow
          displayValue="Title"
          separateDisplayValue
          name="movie-title"
          type="text"
          defaultValue={movie.title}
        />
        <FormRow
          displayValue="Year"
          separateDisplayValue
          name="movie-year"
          type="number"
          defaultValue={movie.year}
        />

        <FormRow
          displayValue="Description"
          separateDisplayValue
          name="movie-description"
          type="textarea"
          defaultValue={movie.description}
        />

        <div className="mx-auto space-x-8 not-prose">
          <button type="submit">Save</button>
          <Link href={`/movies/${movie.id}`}>
            <button>Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
}
