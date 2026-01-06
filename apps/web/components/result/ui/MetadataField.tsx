interface MetadataFieldProps {
   label: string;
   value: string | number;
   isLink?: boolean;
   href?: string;
   className?: string;
}

export function MetadataField({
   label,
   value,
   isLink = false,
   href,
   className = "",
}: MetadataFieldProps) {
   const valueContent = isLink && href ? (
      <a
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="text-black opacity-50 underline break-all"
      >
         {value}
      </a>
   ) : (
      <span className="text-black opacity-50">{value}</span>
   );

   return (
      <div className={`flex flex-col ${className}`}>
         <span className="text-black font-medium mb-1">{label}</span>
         {valueContent}
      </div>
   );
}

