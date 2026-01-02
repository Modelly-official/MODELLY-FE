import { notFound } from 'next/navigation';
import { ReservationFunnel } from './_funnel';

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

  // TODO: recruitment detail API에서 샵/디자이너 정보 가져오기
  // 현재는 임시 mock 데이터 사용
  const mockShopInfo = {
    shopName: '진오헤어',
    branchName: '신촌점',
    designerName: '문원진',
    category: 'HAIR',
    subCategories: ['HAIR_CUT', 'HAIR_PERM'],
  };

  return (
    <ReservationFunnel
      recruitmentId={id}
      shopName={mockShopInfo.shopName}
      branchName={mockShopInfo.branchName}
      designerName={mockShopInfo.designerName}
      category={mockShopInfo.category}
      subCategories={mockShopInfo.subCategories}
    />
  );
}
