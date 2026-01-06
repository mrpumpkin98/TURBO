import { MetadataContainer } from "./MetadataContainer";
import { MetadataField } from "./MetadataField";

interface PhotoData {
   id: string;
   author: string;
   width: number;
   height: number;
   url: string;
   download_url: string;
}

interface PhotoMetadataProps {
   photoData: PhotoData;
}

export function PhotoMetadata({ photoData }: PhotoMetadataProps) {
   return (
      <div className="space-y-4 flex flex-col justify-center">
         {/* Metadata Container 1: id, author */}
         <MetadataContainer>
            <MetadataField label="id" value={photoData.id} />
            <MetadataField label="author" value={photoData.author} />
         </MetadataContainer>

         {/* Metadata Container 2: width, height */}
         <MetadataContainer>
            <MetadataField label="width" value={photoData.width.toLocaleString()} />
            <MetadataField label="height" value={photoData.height.toLocaleString()} />
         </MetadataContainer>

         {/* Metadata Container 3: url, download_url */}
         <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
            <MetadataField label="url" value={photoData.url} isLink href={photoData.url} />
            <MetadataField
               label="download_url"
               value={photoData.download_url}
               isLink
               href={photoData.download_url}
            />
         </div>
      </div>
   );
}

