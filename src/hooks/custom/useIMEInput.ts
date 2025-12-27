import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * IME 조합 중 focus 유지를 위한 커스텀 훅
 * 한글 등 조합형 문자 입력 시 발생하는 focus 이슈 해결
 */
export function useIMEInput(value: string, onChange: (value: string) => void) {
  const isComposingRef = useRef(false);
  const [localValue, setLocalValue] = useState(value);

  // 외부 value가 변경되면 로컬 상태 동기화 (IME 조합 처리 필수)
  useEffect(() => {
    if (!isComposingRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      // IME 조합 중이 아닐 때만 부모에게 전달
      if (!isComposingRef.current) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      isComposingRef.current = false;
      // 조합 완료 시 최종 값 전달
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  return {
    value: localValue,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
  };
}
