/**
 * 타이머 시간 포맷팅 (MM:SS)
 */
export const formatTimerDisplay = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};
