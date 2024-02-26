import errorMessage from '@/app/api/utils/responses';
import { getUserId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextRequest } from 'next/server';

// Use the id in the request!
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Or should ownership be based on the owner of the event?
  const eventId = Number(params.id);
  const userId = await getUserId();
  const body = await req.json();
  const movieEventId = Number(body.movieEventId);
  const possibleOwnedMovieEvent = await prisma.movieEvent.findFirst({
    where: {
      id: movieEventId,
      userId: userId
    }
  });

  if (possibleOwnedMovieEvent == null) {
    return errorMessage('Permission denied', 403);
  }

  try {
    const removedMovie = await prisma.movieEvent.delete({
      where: {
        id: movieEventId,
        userId: userId
      }
    });
    return Response.json({
      data: removedMovie
    });
  } catch (e: any) {
    return errorMessage(e.message, 500);
  }
}
