import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serifFont = Playfair_Display({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PERFORMANCE DETECTIVE - Web Performance Investigation",
  description: "Performance Detective analyzes your website like a case file, uncovering hidden issues, measuring impact, and revealing exactly what to fix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} dark antialiased`}
    >
      <body className="bg-[#070709] text-zinc-100 font-sans selection:bg-[#c8b082] selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
