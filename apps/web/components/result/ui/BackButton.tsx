import { Button } from "@repo/ui";

interface BackButtonProps {
   onClick: () => void;
   className?: string;
   children?: React.ReactNode;
}

export function BackButton({ onClick, className = "", children = "이전" }: BackButtonProps) {
   return (
      <div className="pt-2 flex justify-center">
         <Button
            variant="primary"
            size="md"
            onClick={onClick}
            className={`w-full md:w-[154px] ${className}`}
         >
            {children}
         </Button>
      </div>
   );
}

