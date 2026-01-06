import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Viewer",
  description: "View photos using Picsum API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

