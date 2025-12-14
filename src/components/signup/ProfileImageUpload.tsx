"use client";

import { useRef } from "react";
import Image from "next/image";
import CameraIcon from "@/public/icons/signup/camera.svg";

interface ProfileImageUploadProps {
  profileImage: string | null;
  onImageUpload: (file: File) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ profileImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[110px] h-[110px]">
        <div className="w-[110px] h-[110px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {profileImage ? (
            <Image src={profileImage} alt="프로필" width={110} height={110} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-500" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
        >
          <CameraIcon />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
