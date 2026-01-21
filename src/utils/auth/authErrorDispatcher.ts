import { AUTH_ERROR_EVENT, AuthErrorEvent } from '@/src/types/auth/authError';

export function dispatchAuthError(error: AuthErrorEvent): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT, { detail: error }));
  }
}
