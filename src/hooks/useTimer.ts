import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialTime = 0) {
  const [timeElapsed, setTimeElapsed] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now() - initialTime * 1000);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - timeElapsed * 1000;
      setIsRunning(true);
    }
  }, [isRunning, timeElapsed]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeElapsed(0);
    startTimeRef.current = Date.now();
  }, []);

  const setTime = useCallback((time: number) => {
    setTimeElapsed(time);
    startTimeRef.current = Date.now() - time * 1000;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning, pause]);

  return {
    timeElapsed,
    isRunning,
    start,
    pause,
    reset,
    setTime,
  };
}
