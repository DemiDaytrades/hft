import { requireAdmin } from '@/lib/dal';
import Scheduler from '@/components/teaching/Scheduler';

export default async function TeachingPage() {
  await requireAdmin();
  return <Scheduler admin />;
}
