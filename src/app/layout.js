import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Providers } from "@/components/Providers";
import DevDisclaimer from "@/components/DevDisclaimer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Peti - Care for Your Pet",
  description: "A beautiful pet care service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${quicksand.variable} font-sans antialiased bg-[#F8F9FA]`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <DevDisclaimer />
        </Providers>
      </body>
    </html>
  );
}
