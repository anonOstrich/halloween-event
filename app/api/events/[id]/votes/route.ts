import { prisma } from '@/utils/db';
import { NextRequest } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const dbData = await prisma.vote.findMany({
    where: {
      movieEventId: Number(params.id)
    }
  });

  // Could be done already in the database query
  const votes = {
    posVotes: dbData.filter((v) => v.voteType === 'POSITIVE').length,
    neutralVotes: dbData.filter((v) => v.voteType === 'NEUTRAL').length,
    negVotes: dbData.filter((v) => v.voteType === 'NEGATIVE').length
  };

  return Response.json(
    {
      data: {
        votes: votes
      }
    },
    {
      status: 200
    }
  );
};
