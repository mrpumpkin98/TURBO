"use client";

import { ResultSkeleton } from "./ui/ResultSkeleton";
import { BackgroundImage } from "./ui/BackgroundImage";
import { ResultContent } from "./ui/ResultContent";
import { usePhotoData } from "./hooks/usePhotoData";
import { useConditionalRedirect } from "./hooks/useConditionalRedirect";
import { useNavigation } from "./hooks/useNavigation";

export default function Result() {
   const { photoData, isLoading, isClient, _hasHydrated } = usePhotoData();
   const { goHome } = useNavigation();

   // 데이터가 없으면 1초 후 메인 페이지로 리다이렉트
   useConditionalRedirect({
      condition: isClient && _hasHydrated && !photoData,
      redirectPath: "/",
      delay: 1000,
   });

   return (
      <main className="min-h-screen relative flex items-center justify-center py-24 md:py-20 lg:py-0 overflow-hidden">
         {/* Background Image */}
         {!isLoading && photoData && (
            <BackgroundImage imageUrl={photoData.download_url} blur={8} overlayOpacity={60} />
         )}

         {/* Content */}
         <div className="relative z-10 w-full px-4">
            {isLoading || !photoData ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
                  <ResultSkeleton />
               </div>
            ) : (
               <ResultContent photoData={photoData} onGoBack={goHome} />
            )}
         </div>
      </main>
   );
}
