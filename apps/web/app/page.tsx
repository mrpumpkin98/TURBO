"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@repo/ui";
import { usePhotoStore, type PhotoData } from "../stores/photoStore";

const fetchPhotoData = async (): Promise<PhotoData> => {
   const response = await fetch("https://picsum.photos/id/0/info");
   if (!response.ok) {
      throw new Error("Failed to fetch photo data");
   }
   return response.json();
};

export default function Home() {
   const router = useRouter();
   const applicantName = "신재욱";
   const { setPhotoData, setApplicantName } = usePhotoStore();
   const throttleRef = useRef<boolean>(false);
   const THROTTLE_DELAY = 1000; // 1초

   const mutation = useMutation({
      mutationFn: fetchPhotoData,
      onSuccess: (data) => {
         setPhotoData(data);
         setApplicantName(applicantName);
         router.push("/result");
      },
      onError: (error) => {
         console.error("Error fetching photo:", error);
         alert("사진을 불러오는 중 오류가 발생했습니다.");
      },
   });

   const handleNext = () => {
      // 로딩 중이거나 스로틀링 중이면 클릭 무시
      if (mutation.isPending || throttleRef.current) {
         return;
      }

      throttleRef.current = true;
      mutation.mutate();

      setTimeout(() => {
         throttleRef.current = false;
      }, THROTTLE_DELAY);
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
