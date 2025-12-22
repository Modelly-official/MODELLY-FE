/**
 * JWT 유틸: 토큰에서 userId 추출 - 채팅방에서 user 구분용
 */
export function parseUserIdFromToken(token: string | null): number | null {
  if (typeof window === 'undefined') return null;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const id = payload.userId ?? payload.sub ?? payload.id;
    const num = typeof id === 'string' ? Number(id) : id;
    return Number.isFinite(num) ? num : null;
  } catch (err) {
    console.warn('token parse failed', err);
    return null;
  }
}

export default parseUserIdFromToken;
