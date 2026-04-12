import type { Metadata } from "next";

import { AppProviders } from "@/app/providers";
import { unstable_ViewTransition as ViewTransition } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "The Classic Games Partner Dashboard",
  description: "Partner dashboard implemented from Figma with a glass design system.",
  icons: {
    icon: "https://theclassic.games/assets/img/logo_theclassic.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ViewTransition>
          <AppProviders>{children}</AppProviders>
        </ViewTransition>
      </body>
    </html>
  );
}
