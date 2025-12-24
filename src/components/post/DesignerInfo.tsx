'use client';

import Image from 'next/image';
import Link from 'next/link';

interface DesignerInfoProps {
  designerId: number;
  designerName: string;
  shopName: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export default function DesignerInfo({
  designerId,
  designerName,
  shopName,
  location,
  rating,
  reviewCount,
}: DesignerInfoProps) {
  return (
    <Link href={`/designer/${designerId}`} className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-body-1-medium text-gray-800">{designerName}</span>
        <span className="text-body-2-medium text-gray-800">·</span>
        <span className="text-body-1-medium text-gray-800">{shopName}</span>
        <Image src="/icons/common/arrow-down.svg" alt="디자이너 정보" width={16} height={16} className="rotate-270" />
      </div>

      <div className="flex flex-col gap-1">
        {/* 위치 */}
        <div className="flex items-center gap-1">
          <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
          <span className="text-body-2-medium text-gray-700">{location}</span>
        </div>

        {/* 별점 및 리뷰 */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <Image src="/icons/common/star.svg" alt="별점" width={16} height={16} />
            <span className="text-body-2-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
          <span className="text-body-2-medium text-gray-800">·</span>
          <span className="text-body-2-medium text-gray-700">리뷰 {reviewCount}</span>
        </div>
      </div>
    </Link>
  );
}
