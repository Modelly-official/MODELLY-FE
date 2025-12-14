"use client";

import { useRef } from "react";
import Image from "next/image";
import SignupHeader from "@/src/components/signup/SignupHeader";
import CustomDropdown from "@/src/components/signup/CustomDropdown";
import { useSignupStore } from "@/src/stores/useSignupStore";

interface StepProfileInfoProps {
  goPrev: () => void;
  goNext: () => void;
  isSocial?: boolean;
}

export default function StepProfileInfo({ goPrev, goNext, isSocial = false }: StepProfileInfoProps) {
  const {
    role,
    nickname,
    gender,
    birthDate,
    storeName,
    address,
    detailAddress,
    category,
    profileImage,
    setField,
    setProfileImage,
  } = useSignupStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 주소 검색
  const handleAddressSearch = () => {
    alert("주소 검색 기능은 추후 구현됩니다");
  };

  // 생년월일 입력 포맷팅 (YYYY.MM.DD)
  const handleBirthDateChange = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    const limited = numbers.slice(0, 8);
    let formatted = limited;
    if (limited.length > 4) {
      formatted = `${limited.slice(0, 4)}.${limited.slice(4)}`;
    }
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 4)}.${limited.slice(4, 6)}.${limited.slice(6)}`;
    }
    setField("birthDate", formatted);
  };

  const isDesigner = role === "designer";

  // 폼 유효성 검사
  const isFormValid = isDesigner
    ? profileImage && nickname && gender && birthDate && storeName && address && category
    : profileImage && nickname && gender && birthDate;

  return (
    <>
      <SignupHeader 
        onBack={goPrev} 
        totalSteps={isSocial ? 3 : 5} 
        currentStep={isSocial ? 3 : 5} 
      />
      <div className="mt-12 ml-4">
        <p className="text-black text-head-3-semibold tracking-tight mb-0">Modelly에서 사용할</p>
        <p className="text-black text-head-3-semibold tracking-tight mb-0">프로필 정보를 입력해주세요</p>
      </div>
      
      <form className="flex flex-col gap-6 mt-10 mx-4 w-[343px]" onSubmit={(e) => e.preventDefault()}>
        {/* 프로필 사진 */}
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
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Image src="/icons/signup/camera.svg" alt="카메라" width={36} height={36} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 디자이너 닉네임 / 닉네임 */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-body-1-medium">
              {isDesigner ? "디자이너 활동명" : "닉네임"}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-400 rounded-xl px-4 py-3 pr-10 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
                placeholder="활동명을 입력해주세요"
                value={nickname}
                onChange={(e) => setField("nickname", e.target.value)}
                maxLength={20}
              />
              {nickname && (
                <button
                  type="button"
                  onClick={() => setField("nickname", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <Image src="/icons/signup/delete.svg" alt="삭제" width={18} height={18} />
                </button>
              )}
            </div>
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-body-1-medium">성별</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setField("gender", "남자")}
                className={`flex-1 py-3 rounded-xl text-body-2-medium cursor-pointer ${
                  gender === "남자"
                    ? "bg-blue-600 text-white border-none"
                    : "bg-white text-gray-600 border border-gray-400"
                }`}
              >
                남자
              </button>
              <button
                type="button"
                onClick={() => setField("gender", "여자")}
                className={`flex-1 py-3 rounded-xl text-body-2-medium cursor-pointer ${
                  gender === "여자"
                    ? "bg-blue-600 text-white border-none"
                    : "bg-white text-gray-600 border border-gray-400"
                }`}
              >
                여자
              </button>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-body-1-medium">생년월일</label>
            <input
              type="text"
              className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
              placeholder="생년월일을 입력해주세요"
              value={birthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              maxLength={10}
            />
          </div>

          {/* 디자이너 용 필드들 */}
          {isDesigner && (
            <>
              {/* 매장 이름 */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-body-1-medium">매장 이름</label>
                <input
                  type="text"
                  className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
                  placeholder="매장 이름을 입력해주세요"
                  value={storeName}
                  onChange={(e) => setField("storeName", e.target.value)}
                  maxLength={20}
                />
              </div>
              {/* 매장 주소 */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-body-1-medium">매장 주소</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-400 rounded-xl px-4 py-3 pr-10 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none cursor-pointer"
                    placeholder="매장 주소를 입력해주세요"
                    value={address}
                    readOnly
                    onClick={handleAddressSearch}
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <Image src="/icons/signup/location.svg" alt="주소 검색" width={22} height={22} />
                  </button>
                </div>
                <input
                  type="text"
                  className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
                  placeholder="상세주소"
                  value={detailAddress}
                  onChange={(e) => setField("detailAddress", e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* 카테고리 */}
              <CustomDropdown
                label="카테고리"
                value={category}
                onChange={(value) => setField("category", value)}
                placeholder="헤어/네일/타투/속눈썹"
                options={[
                  { value: "헤어", label: "헤어" },
                  { value: "네일", label: "네일" },
                  { value: "타투", label: "타투" },
                  { value: "속눈썹", label: "속눈썹" },
                ]}
              />
            </>
          )}
        </div>

        <button
          type="button"
          className={`w-full mt-[45px] mb-[42px] py-4 cursor-pointer rounded-full flex items-center justify-center text-body-1-semibold tracking-tight ${
            isFormValid ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}
          disabled={!isFormValid}
          onClick={goNext}
        >
          다음
        </button>
      </form>
    </>
  );
}
