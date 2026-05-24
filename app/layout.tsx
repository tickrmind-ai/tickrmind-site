import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TickrMind | AI Trading Coach",
  description:
    "TickrMind helps traders grade setups, avoid weak entries, and make calmer decisions with AI coaching."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
