import { usePhotoStore } from "../../../stores/photoStore";
import { useClientSide } from "./useClientSide";

/**
 * 사진 데이터와 로딩 상태를 관리하는 훅
 * @returns 사진 데이터, 로딩 상태, hydration 상태
 */
export function usePhotoData() {
   const { photoData, _hasHydrated } = usePhotoStore();
   const isClient = useClientSide();

   const isLoading = !isClient || !_hasHydrated || !photoData;

   return {
      photoData,
      isLoading,
      isClient,
      _hasHydrated,
   };
}
