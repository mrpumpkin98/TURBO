import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseConditionalRedirectOptions {
   condition: boolean;
   redirectPath: string;
   delay?: number;
}

/**
 * 조건이 만족될 때 지정된 경로로 리다이렉트하는 훅
 * @param condition - 리다이렉트 조건
 * @param redirectPath - 리다이렉트할 경로
 * @param delay - 리다이렉트 지연 시간 (ms, 기본값: 0)
 */
export function useConditionalRedirect({
   condition,
   redirectPath,
   delay = 0,
}: UseConditionalRedirectOptions) {
   const router = useRouter();

   useEffect(() => {
      if (condition) {
         const timer = setTimeout(() => {
            router.push(redirectPath);
         }, delay);

         return () => clearTimeout(timer);
      }
   }, [condition, redirectPath, delay, router]);
}
