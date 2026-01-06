import { useEffect, useState } from "react";

/**
 * 클라이언트 사이드에서만 실행되는지 확인하는 훅
 * @returns 클라이언트 사이드인지 여부
 */
export function useClientSide(): boolean {
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   return isClient;
}
