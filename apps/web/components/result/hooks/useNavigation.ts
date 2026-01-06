import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * 네비게이션 관련 유틸리티 훅
 * @returns 네비게이션 함수들
 */
export function useNavigation() {
   const router = useRouter();

   const goTo = useCallback(
      (path: string) => {
         router.push(path);
      },
      [router]
   );

   const goBack = useCallback(() => {
      router.back();
   }, [router]);

   const goHome = useCallback(() => {
      router.push("/");
   }, [router]);

   return {
      goTo,
      goBack,
      goHome,
   };
}

