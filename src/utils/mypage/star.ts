/**
 * 별점 관련 유틸리티 함수
 * 0.5 단위 반별 지원
 */

export type StarState = 'full' | 'half' | 'empty';

/**
 * 별점과 별 번호를 기반으로 별 상태를 결정
 * @param rating - 현재 별점 (0~5)
 * @param star - 별 번호 (1~5)
 * @returns 'full' | 'half' | 'empty'
 */
export function getStarState(rating: number, star: number): StarState {
  if (rating >= star) return 'full';
  if (rating >= star - 0.5) return 'half';
  return 'empty';
}

/**
 * 별 상태에 따른 아이콘 경로 반환
 * @param state - 별 상태
 * @returns 아이콘 경로
 */
export function getStarIcon(state: StarState): string {
  if (state === 'full') return '/icons/common/star.svg';
  if (state === 'half') return '/icons/common/star-half.svg';
  return '/icons/common/star-empty.svg';
}
