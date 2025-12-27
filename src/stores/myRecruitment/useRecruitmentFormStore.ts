import { create } from 'zustand';
import type { Category } from '@/src/types/recruitment';
import type { RecruitmentFormState, PurposeType } from '@/src/types/myRecruitment';

const INITIAL_STATE: RecruitmentFormState = {
  // Step 1: 제목 + 날짜/시간
  title: '',
  selectedDates: [],
  selectedTimes: {},
  applyTimesToAll: false,

  // Step 2: 시술 내용 + 카테고리 + 제한사항 + 전달사항 + 목적 + 동의
  content: '',
  category: null,
  subCategory: null,
  restrictions: '',
  notice: '',
  purpose: null,
  purposeDetail: '',

  // 사전 동의 사항
  agreeVideo: false,
  agreeInsta: false,
  agreeMosaic: false,
  agreeEtc: false,
  etc: '',

  // 이미지
  imageFiles: [],
  imagePreviewUrls: [],
  thumbnail: '',
  imageUrls: [],
  imageFolderId: '',
};

interface RecruitmentFormStore extends RecruitmentFormState {
  // Step 1 actions
  setTitle: (title: string) => void;
  setSelectedDates: (dates: string[]) => void;
  addDates: (dates: string[]) => void;
  toggleDate: (date: string) => void;
  setSelectedTimes: (times: Record<string, string[]>) => void;
  setTimesForDate: (date: string, times: string[]) => void;
  toggleTimeForDate: (date: string, time: string) => void;
  setApplyTimesToAll: (apply: boolean) => void;
  applyFocusedDateTimesToAll: (focusedDate: string) => void;

  // Step 2 actions
  setContent: (content: string) => void;
  setCategory: (category: Category | null) => void;
  setSubCategory: (subCategory: string | null) => void;
  setRestrictions: (restrictions: string) => void;
  setNotice: (notice: string) => void;
  setPurpose: (purpose: PurposeType | null) => void;
  setPurposeDetail: (detail: string) => void;

  // 동의 actions
  setAgreeVideo: (agree: boolean) => void;
  setAgreeInsta: (agree: boolean) => void;
  setAgreeMosaic: (agree: boolean) => void;
  setAgreeEtc: (agree: boolean) => void;
  setEtc: (etc: string) => void;

  // 이미지 actions
  setImageFiles: (files: File[]) => void;
  addImageFiles: (files: File[]) => void;
  removeImageFile: (index: number) => void;
  setImagePreviewUrls: (urls: string[]) => void;
  setThumbnail: (thumbnail: string) => void;
  setImageUrls: (urls: string[]) => void;
  setImageFolderId: (folderId: string) => void;

  // 유틸리티 actions
  reset: () => void;
  initForEdit: (data: Partial<RecruitmentFormState>) => void;
}

export const useRecruitmentFormStore = create<RecruitmentFormStore>((set) => ({
  ...INITIAL_STATE,

  // Step 1 actions
  setTitle: (title) => set({ title }),

  setSelectedDates: (dates) => set({ selectedDates: dates }),

  addDates: (dates) =>
    set((state) => {
      const combined = [...new Set([...state.selectedDates, ...dates])].sort();
      return { selectedDates: combined };
    }),

  toggleDate: (date) =>
    set((state) => {
      const isSelected = state.selectedDates.includes(date);
      if (isSelected) {
        const newTimes = { ...state.selectedTimes };
        delete newTimes[date];
        return {
          selectedDates: state.selectedDates.filter((d) => d !== date),
          selectedTimes: newTimes,
        };
      }
      return {
        selectedDates: [...state.selectedDates, date].sort(),
      };
    }),

  setSelectedTimes: (times) => set({ selectedTimes: times }),

  setTimesForDate: (date, times) =>
    set((state) => ({
      selectedTimes: { ...state.selectedTimes, [date]: times },
    })),

  toggleTimeForDate: (date, time) =>
    set((state) => {
      const currentTimes = state.selectedTimes[date] || [];
      const isSelected = currentTimes.includes(time);
      const newTimes = isSelected
        ? currentTimes.filter((t) => t !== time)
        : [...currentTimes, time].sort();
      return {
        selectedTimes: { ...state.selectedTimes, [date]: newTimes },
      };
    }),

  setApplyTimesToAll: (apply) => set({ applyTimesToAll: apply }),

  applyFocusedDateTimesToAll: (focusedDate) =>
    set((state) => {
      if (state.selectedDates.length === 0 || !focusedDate) return state;
      // 현재 포커스된 날짜의 시간을 기준으로 모든 날짜에 적용
      const focusedTimes = state.selectedTimes[focusedDate] || [];
      const newTimes: Record<string, string[]> = {};
      state.selectedDates.forEach((date) => {
        newTimes[date] = [...focusedTimes];
      });
      return { selectedTimes: newTimes };
    }),

  // Step 2 actions
  setContent: (content) => set({ content }),

  setCategory: (category) =>
    set({
      category,
      subCategory: null, // 카테고리 변경 시 서브카테고리 초기화
    }),

  setSubCategory: (subCategory) => set({ subCategory }),

  setRestrictions: (restrictions) => set({ restrictions }),

  setNotice: (notice) => set({ notice }),

  setPurpose: (purpose) =>
    set({
      purpose,
      purposeDetail: purpose === 'OTHER' ? '' : '', // 기타 외 선택 시 상세 초기화
    }),

  setPurposeDetail: (purposeDetail) => set({ purposeDetail }),

  // 동의 actions
  setAgreeVideo: (agree) => set({ agreeVideo: agree }),

  setAgreeInsta: (agree) => set({ agreeInsta: agree }),

  setAgreeMosaic: (agree) => set({ agreeMosaic: agree }),

  setAgreeEtc: (agree) =>
    set({
      agreeEtc: agree,
      etc: agree ? '' : '', // 체크 해제 시 내용 초기화
    }),

  setEtc: (etc) => set({ etc }),

  // 이미지 actions
  setImageFiles: (files) => set({ imageFiles: files }),

  addImageFiles: (files) =>
    set((state) => ({
      imageFiles: [...state.imageFiles, ...files],
    })),

  removeImageFile: (index) =>
    set((state) => ({
      imageFiles: state.imageFiles.filter((_, i) => i !== index),
      imagePreviewUrls: state.imagePreviewUrls.filter((_, i) => i !== index),
    })),

  setImagePreviewUrls: (urls) => set({ imagePreviewUrls: urls }),

  setThumbnail: (thumbnail) => set({ thumbnail }),

  setImageUrls: (urls) => set({ imageUrls: urls }),

  setImageFolderId: (folderId) => set({ imageFolderId: folderId }),

  // 유틸리티 actions
  reset: () => set(INITIAL_STATE),

  initForEdit: (data) =>
    set({
      ...INITIAL_STATE,
      ...data,
    }),
}));
