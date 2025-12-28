'use client';

import { useRef } from 'react';
import Image from 'next/image';
import CameraIcon from '@/public/icons/signup/camera.svg';
import { validateImageFile } from '@/src/utils';
import { useToast } from '@/src/hooks/common/useToast';

interface ProfileImageUploadProps {
  profileImage: string | null;
  onImageUpload: (file: File) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ profileImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { isValid, error } = validateImageFile(file);
    if (!isValid) {
      showToast(error!);
      return;
    }

    onImageUpload(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[110px] w-[110px]">
        <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {profileImage ? (
            <Image src={profileImage} alt="프로필" width={110} height={110} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-500" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
        >
          <CameraIcon />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
    </div>
  );
};
