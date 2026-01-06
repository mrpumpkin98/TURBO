import { useRef, useCallback } from "react";

interface UseThrottleOptions {
   delay?: number;
}

/**
 * 함수 호출을 스로틀링하는 훅
 * @param delay - 스로틀링 지연 시간 (ms, 기본값: 1000)
 * @returns 스로틀링된 함수와 현재 스로틀링 상태
 */
export function useThrottle({ delay = 1000 }: UseThrottleOptions = {}) {
   const throttleRef = useRef<boolean>(false);

   const throttledFn = useCallback(
      (fn: () => void) => {
         if (throttleRef.current) {
            return;
         }

         throttleRef.current = true;
         fn();

         setTimeout(() => {
            throttleRef.current = false;
         }, delay);
      },
      [delay]
   );

   return {
      throttledFn,
      isThrottling: throttleRef.current,
   };
}

