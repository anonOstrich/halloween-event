import SignUpSecretForm from '@/components/SignUpSecretForm';
import { getSecret } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { SignUp } from '@clerk/nextjs';
import { cookies } from 'next/headers';

async function hasProvidedSecret(fingerPrint: string | undefined) {
  if (fingerPrint === undefined) return false;

  const row = await prisma.possibleRegistrar.findFirst({
    where: {
      hash: fingerPrint
    }
  });
  return row !== null;
}

export default async function Page() {
  const fingerPrint = cookies().get('fingerPrint')?.value;
  const secretProvided = await hasProvidedSecret(fingerPrint);

  if (!secretProvided) {
    return <SignUpSecretForm />;
  }

  return (
    <div className="flex justify-center mt-4">
      <SignUp />
    </div>
  );
}
