import type { Metadata } from "next";
import AuthWrapper from "@/components/AuthWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clubhouse - Yippybot Dashboard",
  description: "Real-time monitoring and control of Yippybot activities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
