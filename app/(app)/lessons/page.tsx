import { requireActiveMember } from '@/lib/dal';
import Scheduler from '@/components/teaching/Scheduler';

export default async function LessonsPage() {
  await requireActiveMember();
  return <Scheduler />;
}
