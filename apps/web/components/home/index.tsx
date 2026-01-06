"use client";

import { Button } from "@repo/ui";
import { usePhotoStore } from "../../stores/photoStore";
import { useClientSide } from "./hooks/useClientSide";
import { useAutoRedirect } from "./hooks/useAutoRedirect";
import { useThrottle } from "./hooks/useThrottle";
import { usePhotoMutation } from "./hooks/usePhotoMutation";

export default function Home() {
   const applicantName = "신재욱";
   const { photoData, _hasHydrated } = usePhotoStore();
   const isClient = useClientSide();
   const { throttledFn } = useThrottle({ delay: 1000 });
   const mutation = usePhotoMutation({ applicantName });

   // 사진 조회 이력이 있으면 자동으로 /result 페이지로 이동
   useAutoRedirect({
      condition: isClient && _hasHydrated && !!photoData,
      redirectPath: "/result",
   });

   const handleNext = () => {
      // 로딩 중이면 클릭 무시
      if (mutation.isPending) {
         return;
      }

      throttledFn(() => {
         mutation.mutate();
      });
   };

   return (
      <main className="min-h-screen flex flex-col bg-white relative">
         <div className="w-full max-w-md mx-auto min-h-screen  flex flex-col">
            <div className="flex-1 flex items-center justify-center">
               <h2 className="text-[32px] font-bold text-black text-center">
                  안녕하세요
                  <br />
                  {applicantName}입니다.
               </h2>
            </div>
            <div className="w-full pb-8">
               <Button
                  variant="primary"
                  size="md"
                  isLoading={mutation.isPending}
                  onClick={handleNext}
                  className="w-full"
               >
                  다음
               </Button>
            </div>
         </div>
      </main>
   );
}
