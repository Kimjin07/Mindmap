import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Stack",
  description: "Applications · Models · Infrastructure · Chips · Energy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
