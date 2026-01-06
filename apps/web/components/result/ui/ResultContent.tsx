import { PhotoImage } from "./PhotoImage";
import { PhotoMetadata } from "./PhotoMetadata";
import { BackButton } from "./BackButton";
import type { PhotoData } from "../../../stores/photoStore";

interface ResultContentProps {
   photoData: PhotoData;
   onGoBack: () => void;
   onImageLoad?: () => void;
}

export function ResultContent({ photoData, onGoBack, onImageLoad }: ResultContentProps) {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
         {/* Left Panel - Image */}
         <PhotoImage
            src={photoData.download_url}
            alt={`Photo by ${photoData.author}`}
            onLoad={onImageLoad}
         />

         {/* Right Panel - Metadata */}
         <div className="space-y-4 flex flex-col justify-center">
            <PhotoMetadata photoData={photoData} />
            <BackButton onClick={onGoBack} />
         </div>
      </div>
   );
}
