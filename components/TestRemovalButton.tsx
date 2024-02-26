'use client';
import { removeMovieFromEvent } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

// Cannot pass a function from server -> client component,
// so using ids
interface TestRemovalButtonProps {
  removalIdType: 'movieEvent';
  removalId: number;
}

export default function TestRemovalButton({
  removalIdType,
  removalId
}: TestRemovalButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      switch (removalIdType) {
        case 'movieEvent':
          const removedMovie = await removeMovieFromEvent(removalId);
          toast.success(`Movie removed`);
          break;
        default:
          throw new Error('Not implemented');
      }
      router.refresh();
    } catch (e: any) {
      toast.error(`Failed to delete: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="bg-danger dark:bg-dark-danger
      absolute top-0 right-0
       rounded-tr-[inherit]
      hover:brightness-90 dark:hover:brightness-110
      hover:shadow-lg px-2 py-1 md:px-4 md:py-2"
      disabled={loading}
      onClick={handleDelete}
    >
      Remove
    </button>
  );
}
