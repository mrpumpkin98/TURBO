export function ResultSkeleton() {
   return (
      <>
         {/* Left Panel - Image Skeleton */}
         <div className="">
            <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse" />
         </div>

         {/* Right Panel - Metadata Skeleton */}
         <div className="space-y-4 flex flex-col justify-center">
            {/* Metadata Container 1 Skeleton: id, author */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                     <div className="h-4 w-8 bg-gray-200 rounded mb-2 animate-pulse" />
                     <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                     <div className="h-4 w-12 bg-gray-200 rounded mb-2 animate-pulse" />
                     <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
               </div>
            </div>

            {/* Metadata Container 2 Skeleton: width, height */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                     <div className="h-4 w-12 bg-gray-200 rounded mb-2 animate-pulse" />
                     <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                     <div className="h-4 w-14 bg-gray-200 rounded mb-2 animate-pulse" />
                     <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
               </div>
            </div>

            {/* Metadata Container 3 Skeleton: url, download_url */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
               <div className="flex flex-col">
                  <div className="h-4 w-8 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
               </div>
               <div className="flex flex-col">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
               </div>
            </div>

            {/* Button Skeleton */}
            <div className="pt-2 flex justify-center">
               <div className="w-full md:w-[154px] h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
         </div>
      </>
   );
}
