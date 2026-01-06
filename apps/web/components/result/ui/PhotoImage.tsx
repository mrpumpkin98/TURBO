"use client";

import { useEffect, useRef } from "react";

interface PhotoImageProps {
   src: string;
   alt: string;
   className?: string;
   onLoad?: () => void;
}

export function PhotoImage({ src, alt, className = "", onLoad }: PhotoImageProps) {
   const imgRef = useRef<HTMLImageElement>(null);

   useEffect(() => {
      const img = imgRef.current;
      if (img && img.complete && onLoad) {
         // 이미지가 이미 로드되어 있는 경우
         onLoad();
      }
   }, [src, onLoad]);

   return (
      <div className="">
         <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`w-full h-auto rounded-3xl ${className}`}
            onLoad={() => onLoad?.()}
         />
      </div>
   );
}

