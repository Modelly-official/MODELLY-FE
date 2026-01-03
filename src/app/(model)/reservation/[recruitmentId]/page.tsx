import { notFound } from 'next/navigation';
import { ReservationContainer } from './_funnel';

interface ReservationPageProps {
  params: Promise<{ recruitmentId: string }>;
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { recruitmentId } = await params;
  const id = parseInt(recruitmentId, 10);

  // 유효하지 않은 ID
  if (isNaN(id) || id <= 0) {
    notFound();
  }

  return <ReservationContainer recruitmentId={id} />;
}
