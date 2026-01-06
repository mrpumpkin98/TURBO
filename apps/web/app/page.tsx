"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@repo/ui";

interface PhotoData {
   id: string;
   author: string;
   width: number;
   height: number;
   url: string;
   download_url: string;
}

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

   const mutation = useMutation({
      mutationFn: fetchPhotoData,
      onSuccess: (data) => {
         sessionStorage.setItem("photoData", JSON.stringify(data));
         sessionStorage.setItem("applicantName", applicantName);
         router.push("/result");
      },
      onError: (error) => {
         console.error("Error fetching photo:", error);
         alert("사진을 불러오는 중 오류가 발생했습니다.");
      },
   });

   const handleNext = () => {
      mutation.mutate();
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
