import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: "primary";
   size?: "sm" | "md" | "lg";
   isLoading?: boolean;
   children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
   variant = "primary",
   size = "md",
   isLoading = false,
   children,
   className = "",
   disabled,
   ...props
}) => {
   const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]";

   const variantStyles = {
      primary:
         "bg-[#111111] text-white hover:bg-[#111111]/80 focus:ring-gray-500 active:bg-[#111111]/70",
      secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400 active:bg-gray-700",
   };

   const sizeStyles = {
      sm: "px-3 py-3 text-sm",
      md: "px-3 py-3 text-base",
      lg: "px-3 py-3 text-lg",
   };

   const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

   return (
      <button className={combinedClassName} disabled={disabled || isLoading} {...props}>
         {isLoading ? (
            <div className="flex items-center gap-1.5">
               <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
               >
                  <circle
                     className="opacity-25"
                     cx="12"
                     cy="12"
                     r="10"
                     stroke="currentColor"
                     strokeWidth="4"
                  ></circle>
                  <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
               </svg>
               <span>로딩중...</span>
            </div>
         ) : (
            children
         )}
      </button>
   );
};
