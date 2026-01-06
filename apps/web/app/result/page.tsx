"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { usePhotoStore } from "../../stores/photoStore";
import { ResultSkeleton } from "../../components/ResultSkeleton";

export default function ResultPage() {
   const router = useRouter();
   const { photoData, applicantName, _hasHydrated } = usePhotoStore();
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   useEffect(() => {
      // Wait for hydration to complete before checking data
      if (isClient && _hasHydrated && !photoData) {
         // 1초 후 메인 페이지로 리다이렉트
         const timer = setTimeout(() => {
            router.push("/");
         }, 1000);

         return () => clearTimeout(timer);
      }
   }, [isClient, _hasHydrated, photoData, router]);

   const handleGoBack = () => {
      router.push("/");
   };

   const isLoading = !isClient || !_hasHydrated || !photoData;

   return (
      <main className="min-h-screen relative flex items-center justify-center py-24 md:py-20 lg:py-0 overflow-hidden">
         {/* Background Image */}
         {!isLoading && photoData && (
            <div
               className="absolute inset-0 z-0"
               style={{
                  backgroundImage: `url(${photoData.download_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  filter: "blur(8px)",
               }}
            >
               {/* Overlay for better readability */}
               <div className="absolute inset-0 bg-white/60" />
            </div>
         )}

         {/* Content */}
         <div className="relative z-10 w-full px-4">
            {isLoading ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
                  <ResultSkeleton />
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
                  {/* Left Panel - Image */}
                  <div className="">
                     <img
                        src={photoData.download_url}
                        alt={`Photo by ${photoData.author}`}
                        className="w-full h-auto rounded-3xl"
                     />
                  </div>

                  {/* Right Panel - Metadata */}
                  <div className="space-y-4 flex flex-col justify-center">
                     {/* Metadata Container 1: id, author */}
                     <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="flex flex-col">
                              <span className="text-black font-medium mb-1">id</span>
                              <span className="text-black opacity-50">{photoData.id}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-black font-medium mb-1">author</span>
                              <span className="text-black opacity-50">{photoData.author}</span>
                           </div>
                        </div>
                     </div>

                     {/* Metadata Container 2: width, height */}
                     <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="flex flex-col">
                              <span className="text-black font-medium mb-1">width</span>
                              <span className="text-black opacity-50">
                                 {photoData.width.toLocaleString()}
                              </span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-black font-medium mb-1">height</span>
                              <span className="text-black opacity-50">
                                 {photoData.height.toLocaleString()}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Metadata Container 3: url, download_url */}
                     <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
                        <div className="flex flex-col">
                           <span className="text-black font-medium mb-1">url</span>
                           <a
                              href={photoData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black opacity-50 underline break-all"
                           >
                              {photoData.url}
                           </a>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-black font-medium mb-1">download_url</span>
                           <a
                              href={photoData.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black opacity-50 underline break-all"
                           >
                              {photoData.download_url}
                           </a>
                        </div>
                     </div>

                     {/* Previous Button */}
                     <div className="pt-2 flex justify-center">
                        <Button
                           variant="primary"
                           size="md"
                           onClick={handleGoBack}
                           className="w-full md:w-[154px]"
                        >
                           이전
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>
   );
}
