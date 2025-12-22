'use client';

import { useState, useEffect } from 'react';

/**
 * 타이머 카운트다운 상태 관리 훅
 */
export const useTimer = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return {
    timer,
    startTimer: (seconds: number) => setTimer(seconds),
    resetTimer: () => setTimer(0),
  };
};
