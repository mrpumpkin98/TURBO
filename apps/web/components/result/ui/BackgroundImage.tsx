interface BackgroundImageProps {
   imageUrl: string;
   blur?: number;
   overlayOpacity?: number;
   overlayColor?: "white" | "black";
}

export function BackgroundImage({
   imageUrl,
   blur = 8,
   overlayOpacity = 60,
   overlayColor = "white",
}: BackgroundImageProps) {
   const overlayClass =
      overlayColor === "white" ? `bg-white/${overlayOpacity}` : `bg-black/${overlayOpacity}`;

   return (
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div
            className="absolute inset-0"
            style={{
               backgroundImage: `url(${imageUrl})`,
               backgroundSize: "cover",
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
               filter: `blur(${blur}px)`,
               transform: "scale(1.1)",
            }}
         />
         <div
            className="absolute inset-0 bg-white"
            style={{
               opacity: overlayOpacity / 100,
            }}
         />
      </div>
   );
}
