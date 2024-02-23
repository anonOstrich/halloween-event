import { prisma } from '@/utils/db';
import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function NewUser() {
  const user = await currentUser();
  if (!user) {
    return <div>No user access should not be possible 🫢</div>;
  }

  const clerkId = user.id;

  const existingUser = await prisma.user.findFirst({
    where: {
      clerkId
    }
  });

  if (existingUser != null) {
    redirect('/');
    return;
  }

  await prisma.user.create({
    data: {
      email: user.emailAddresses[0].emailAddress,
      clerkId: clerkId
    }
  });

  redirect('/movies');
}
