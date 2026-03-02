import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ML Tracker | Progress is Compounding",
  description: "A strict, data-dense, minimalist ML learning tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#22c55e' }
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0a0a0a] text-zinc-100 selection:bg-green-500/30 font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
