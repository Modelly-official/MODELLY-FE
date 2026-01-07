// 마이페이지 전용 검증 유틸

export const isValidBirthDate = (date: string): boolean => {
  const regex = /^\d{4}\.\d{2}\.\d{2}$/;
  if (!regex.test(date)) return false;
  const [year, month, day] = date.split('.').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
};

export const isValidGender = (gender: string): boolean => gender === '남자' || gender === '여자';

export const isValidCategory = (
  category: string,
  options: { value: string; label: string }[],
): boolean => {
  const trimmed = category.trim();
  const upper = trimmed.toUpperCase();
  // 코드(HAIR 등)도 허용하고, 한글 라벨도 허용
  return options.some((opt) => opt.value === trimmed || opt.value.toUpperCase() === upper);
};
