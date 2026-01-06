import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseAutoRedirectOptions {
   condition: boolean;
   redirectPath: string;
}

/**
 * 조건이 만족될 때 자동으로 리다이렉트하는 훅
 * @param condition - 리다이렉트 조건
 * @param redirectPath - 리다이렉트할 경로
 */
export function useAutoRedirect({ condition, redirectPath }: UseAutoRedirectOptions) {
   const router = useRouter();

   useEffect(() => {
      if (condition) {
         router.push(redirectPath);
      }
   }, [condition, redirectPath, router]);
}

