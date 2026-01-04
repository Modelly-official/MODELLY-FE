'use client';

import Image from 'next/image';

interface AttachedPhotosCardProps {
  imageUrl: string | null;
}

export function AttachedPhotosCard({ imageUrl }: AttachedPhotosCardProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">첨부 사진</span>

      {/* 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image src={imageUrl} alt="첨부 사진" fill className="object-cover" />
      </div>
    </div>
  );
}
