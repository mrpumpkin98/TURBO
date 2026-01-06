interface PhotoImageProps {
   src: string;
   alt: string;
   className?: string;
}

export function PhotoImage({ src, alt, className = "" }: PhotoImageProps) {
   return (
      <div className="">
         <img src={src} alt={alt} className={`w-full h-auto rounded-3xl ${className}`} />
      </div>
   );
}

