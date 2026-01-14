// 디자이너 프로필 관련 타입 정의

// ===== 디자이너 프로필 정보 =====
export interface DesignerProfileInfo {
  designerUserId: number;
  designerId: number;
  nickname: string;
  profileImageUrl: string;
  shop: string;
  address: {
    line1: string;
    line2: string;
  };
  intro: string;
  isLiked: boolean;
}

// ===== 디자이너 프로필 내 공고 카드 =====
export interface DesignerRecruitmentCard {
  recruitmentId: number;
  title: string;
  thumbnailUrl: string;
  startDate: string; // LocalDate
  deadline: string; // LocalDate
  subCategories: string[];
}

// ===== 디자이너 프로필 조회 응답 =====
export interface DesignerProfileResponse {
  profile: DesignerProfileInfo;
  openRecruitments: DesignerRecruitmentCard[];
}
