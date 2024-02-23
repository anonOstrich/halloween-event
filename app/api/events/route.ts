import { prisma } from '@/utils/db';
import { NextRequest } from 'next/server';

// Not currently used, but kept in case I'll switch to client component
export const POST = async (req: NextRequest) => {
  const parsedBody = await req.json();

  return Response.json(
    {
      data: {
        example: 'hewo :3'
      }
    },
    {
      status: 200
    }
  );
};
