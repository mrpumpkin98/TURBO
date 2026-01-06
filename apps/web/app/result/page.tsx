"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@repo/ui";

interface PhotoData {
   id: string;
   author: string;
   width: number;
   height: number;
   url: string;
   download_url: string;
}

const getPhotoDataFromStorage = (): PhotoData | null => {
   if (typeof window === "undefined") return null;
   const storedData = sessionStorage.getItem("photoData");
   if (!storedData) return null;
   try {
      return JSON.parse(storedData);
   } catch {
      return null;
   }
};

const getApplicantNameFromStorage = (): string => {
   if (typeof window === "undefined") return "";
   return sessionStorage.getItem("applicantName") || "";
};

export default function ResultPage() {
   const router = useRouter();

   const { data: photoData, isLoading: isLoadingPhoto } = useQuery<PhotoData | null>({
      queryKey: ["photoData"],
      queryFn: getPhotoDataFromStorage,
      enabled: typeof window !== "undefined",
   });

   const { data: applicantName } = useQuery<string>({
      queryKey: ["applicantName"],
      queryFn: getApplicantNameFromStorage,
      enabled: typeof window !== "undefined",
   });

   useEffect(() => {
      // Only redirect after query has finished loading and no data exists
      if (!isLoadingPhoto && !photoData) {
         router.push("/");
      }
   }, [isLoadingPhoto, photoData, router]);

   const handleGoBack = () => {
      router.push("/");
   };

   if (isLoadingPhoto || !photoData) {
      return (
         <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
               <p className="text-gray-600">로딩 중...</p>
            </div>
         </main>
      );
   }

   return (
      <main className="min-h-screen relative flex items-center justify-center py-24 md:py-20 lg:py-0">
         {/* Background Image */}
         <div
            className="absolute inset-0 z-0"
            style={{
               backgroundImage: "url('/images/Masklayer.svg')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
            }}
         />

         {/* Content */}
         <div className="relative z-10 w-full px-4">
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
                           <span className="text-black opacity-50">{photoData.width.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-black font-medium mb-1">height</span>
                           <span className="text-black opacity-50">{photoData.height.toLocaleString()}</span>
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
         </div>
      </main>
   );
}
