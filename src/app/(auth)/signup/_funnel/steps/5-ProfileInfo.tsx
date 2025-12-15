"use client";

import { useState } from "react";
import { 
  SignupHeader, 
  SignupTitle, 
  FixedBottomButton,
  CustomDropdown, 
  TextInput, 
  GenderSelect, 
  AddressInput,
  ProfileImageUpload 
} from "@/src/components/signup";
import { useSignupStore } from "@/src/stores/useSignupStore";
import { formatBirthDate, convertImageToBase64 } from "@/src/utils/validation";
import { SIGNUP_STEPS, SIGNUP_MESSAGES } from "@/src/constants/signup";
import { signup } from "@/src/apis";
import type { SignupStepProps } from "@/src/types/signup";
import type { SignupRequest } from "@/src/types/auth";

interface StepProfileInfoProps extends SignupStepProps {
  goPrev: () => void;
}

export const StepProfileInfo: React.FC<StepProfileInfoProps> = ({ goPrev, goNext, isSocial = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    username,
    password,
    email,
    name,
    phoneNumber,
    setField,
    setProfileImage,
  } = useSignupStore();

  // 프로필 이미지 업로드
  const handleImageUpload = async (file: File) => {
    const base64 = await convertImageToBase64(file);
    setProfileImage(base64);
  };

  // 주소 검색 결과 처리
  const handleAddressSearch = (fullAddress: string) => {
    setField("address", fullAddress);
  };

  // 생년월일 입력 처리
  const handleBirthDateChange = (value: string) => {
    setField("birthDate", formatBirthDate(value));
  };

  const isDesigner = role === "designer";

  // 폼 유효성 검사
  const isFormValid = isDesigner
    ?  nickname && gender && birthDate && storeName && address && category
    :  nickname && gender && birthDate;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const signupData: SignupRequest = {
        base: {
          loginId: username,
          password: password,
          email: email,
          name: name,
          phoneNum: phoneNumber.replace(/-/g, ''),
          gender: gender === "남성" ? "MALE" : "FEMALE",
          birth: birthDate.replace(/\./g, '-'),
          userRole: isDesigner ? "DESIGNER" : "MODEL",
          imageUrl: profileImage || "",
        },
        ...(isDesigner ? {
          designer: {
            shop: storeName,
            addressLine1: address,
            addressLine2: detailAddress || "",
            category: category === "헤어" ? "HAIR" : category === "네일" ? "NAIL" : category === "타투" ? "TATTOO" : "EYELASH",
            nickname: nickname,
          }
        } : {
          model: {
            nickname: nickname,
          }
        })
      };
      
      const response = await signup(signupData);
      
      if (response.isSuccess) {
        goNext();
      } else {
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SignupHeader 
        onBack={goPrev} 
        totalSteps={isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR} 
        currentStep={isSocial ? SIGNUP_STEPS.SOCIAL : SIGNUP_STEPS.REGULAR} 
      />
      <SignupTitle line1={SIGNUP_MESSAGES.PROFILE_INFO.TITLE_1} line2={SIGNUP_MESSAGES.PROFILE_INFO.TITLE_2} />
      
      <form className="flex flex-col gap-6 mt-10 mx-4 w-[343px] flex-1" onSubmit={(e) => e.preventDefault()}>
        <ProfileImageUpload profileImage={profileImage} onImageUpload={handleImageUpload} />
        <div className="flex flex-col gap-6">
          <TextInput
            label={isDesigner ? "디자이너 활동명" : "닉네임"}
            value={nickname}
            onChange={(value) => setField("nickname", value)}
            placeholder="활동명을 입력해주세요"
            maxLength={20}
            showClearButton
          />
          <GenderSelect value={gender} onChange={(value) => setField("gender", value)} />
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
              <TextInput
                label="매장 이름"
                value={storeName}
                onChange={(value) => setField("storeName", value)}
                placeholder="매장 이름을 입력해주세요"
                maxLength={20}
              />
              <AddressInput
                address={address}
                detailAddress={detailAddress}
                onAddressSearch={handleAddressSearch}
                onDetailAddressChange={(value) => setField("detailAddress", value)}
              />
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

        <div className={`mb-[42px] ${isDesigner ? "mt-[45px]" : "mt-auto"}`}>
          <FixedBottomButton 
            disabled={!isFormValid || isSubmitting} 
            onClick={handleSubmit}
          >
            {isSubmitting ? "처리 중..." : SIGNUP_MESSAGES.BUTTON.NEXT}
          </FixedBottomButton>
        </div>
      </form>
    </div>
  );
};
