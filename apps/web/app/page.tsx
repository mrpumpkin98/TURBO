"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";

export default function Home() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const applicantName = "신재욱";

   const handleNext = async () => {
      setIsLoading(true);
      try {
         const response = await fetch("https://picsum.photos/id/0/info");
         const data = await response.json();

         // Store data in sessionStorage to pass to result page
         sessionStorage.setItem("photoData", JSON.stringify(data));
         sessionStorage.setItem("applicantName", applicantName);

         router.push("/result");
      } catch (error) {
         console.error("Error fetching photo:", error);
         alert("사진을 불러오는 중 오류가 발생했습니다.");
      } finally {
         setIsLoading(false);
      }
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
                  isLoading={isLoading}
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
