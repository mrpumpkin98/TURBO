import { ReactNode } from "react";

interface MetadataContainerProps {
   children: ReactNode;
   columns?: 1 | 2;
   className?: string;
}

export function MetadataContainer({
   children,
   columns = 2,
   className = "",
}: MetadataContainerProps) {
   const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-2";

   return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
         <div className={`grid ${gridClass} gap-6`}>{children}</div>
      </div>
   );
}

