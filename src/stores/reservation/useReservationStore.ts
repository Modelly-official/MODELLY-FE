import { create } from 'zustand';

interface ReservationFormState {
  // Step 1: 날짜/시간 선택
  selectedDate: string | null; // yyyy-MM-dd
  selectedTime: string | null; // HH:mm

  // Step 2: 이미지 첨부
  imageFile: File | null;
  imagePreviewUrl: string | null;
  uploadedImageUrl: string | null;

  // Step 3: 내용 작성
  comment: string;
}

const INITIAL_STATE: ReservationFormState = {
  selectedDate: null,
  selectedTime: null,
  imageFile: null,
  imagePreviewUrl: null,
  uploadedImageUrl: null,
  comment: '',
};

interface ReservationStore extends ReservationFormState {
  // Step 1 actions
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;

  // Step 2 actions
  setImageFile: (file: File | null) => void;
  setImagePreviewUrl: (url: string | null) => void;
  setUploadedImageUrl: (url: string | null) => void;
  clearImage: () => void;

  // Step 3 actions
  setComment: (comment: string) => void;

  // 유틸리티 actions
  reset: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  ...INITIAL_STATE,

  // Step 1 actions
  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      selectedTime: null, // 날짜 변경 시 시간 초기화
    }),

  setSelectedTime: (time) => set({ selectedTime: time }),

  // Step 2 actions
  setImageFile: (file) => set({ imageFile: file }),

  setImagePreviewUrl: (url) => set({ imagePreviewUrl: url }),

  setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),

  clearImage: () =>
    set({
      imageFile: null,
      imagePreviewUrl: null,
      uploadedImageUrl: null,
    }),

  // Step 3 actions
  setComment: (comment) => set({ comment }),

  // 유틸리티 actions
  reset: () => set(INITIAL_STATE),
}));
