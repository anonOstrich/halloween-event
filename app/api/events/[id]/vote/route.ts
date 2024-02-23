import { getUserId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { VoteType } from '@prisma/client';
import { NextRequest } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const userId = await getUserId();

  const parsedBody = await req.json();
  const voteType: VoteType = parsedBody.voteType;

  const existingVote = await prisma.vote.findUnique({
    where: {
      movieEventId_userId: {
        movieEventId: Number(id),
        userId: userId
      }
    }
  });

  if (existingVote == null) {
    const vote = await prisma.vote.create({
      data: {
        voteType,
        userId: userId,
        movieEventId: Number(id)
      }
    });

    return Response.json(
      {
        data: {
          vote: vote
        }
      },
      {
        status: 200
      }
    );
  }

  const voteTypeToUse: VoteType =
    existingVote.voteType === voteType ? 'NONVOTE' : voteType;

  const changedVote = await prisma.vote.update({
    where: {
      movieEventId_userId: {
        movieEventId: Number(id),
        userId: userId
      }
    },
    data: {
      voteType: voteTypeToUse
    }
  });

  return Response.json(
    {
      data: {
        vote: changedVote
      }
    },
    {
      status: 200
    }
  );
};
