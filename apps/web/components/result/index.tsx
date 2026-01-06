"use client";

import { useState, useEffect } from "react";
import { ResultSkeleton } from "./ui/ResultSkeleton";
import { BackgroundImage } from "./ui/BackgroundImage";
import { ResultContent } from "./ui/ResultContent";
import { usePhotoData } from "./hooks/usePhotoData";
import { useConditionalRedirect } from "./hooks/useConditionalRedirect";
import { useNavigation } from "./hooks/useNavigation";

export default function Result() {
   const { photoData, isLoading, isClient, _hasHydrated } = usePhotoData();
   const { goHome } = useNavigation();
   const [isImageLoaded, setIsImageLoaded] = useState(false);

   // 데이터가 없으면 1초 후 메인 페이지로 리다이렉트
   useConditionalRedirect({
      condition: isClient && _hasHydrated && !photoData,
      redirectPath: "/",
      delay: 1000,
   });

   // photoData가 변경되면 이미지 로딩 상태 확인
   useEffect(() => {
      if (photoData) {
         setIsImageLoaded(false);
         const img = new Image();
         img.onload = () => setIsImageLoaded(true);
         img.onerror = () => setIsImageLoaded(true); // 에러가 나도 스켈레톤을 숨김
         img.src = photoData.download_url;
         // 이미 로드되어 있으면 즉시 onload 이벤트 발생
         if (img.complete) {
            setIsImageLoaded(true);
         }
      }
   }, [photoData?.download_url]);

   const showSkeleton = isLoading || !photoData || !isImageLoaded;

   return (
      <main className="min-h-screen relative flex items-center justify-center py-24 md:py-20 lg:py-0 overflow-hidden">
         {/* Background Image */}
         {!isLoading && photoData && (
            <BackgroundImage imageUrl={photoData.download_url} blur={20} overlayOpacity={60} />
         )}

         {/* Content */}
         <div className="relative z-10 w-full px-4">
            {showSkeleton ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
                  <ResultSkeleton />
               </div>
            ) : (
               <ResultContent
                  photoData={photoData}
                  onGoBack={goHome}
                  onImageLoad={() => setIsImageLoaded(true)}
               />
            )}
         </div>
      </main>
   );
}
