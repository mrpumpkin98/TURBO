import type { Metadata } from "next";
import "../public/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
   title: "Photo Viewer",
   description: "View photos using Picsum API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="ko">
         <body suppressHydrationWarning>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
