'use client';

import Image from 'next/image';

interface AttachedPhotosCardProps {
  photos: string[];
}

export function AttachedPhotosCard({ photos }: AttachedPhotosCardProps) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">첨부 사진</span>

      {/* 이미지 그리드 */}
      <div className="flex flex-col gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src={photo}
              alt={`첨부 사진 ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
