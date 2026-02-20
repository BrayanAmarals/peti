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
  title: "Peti — O Melhor para o Seu Pet",
  description: "Loja de produtos premium para cães e gatos. Alimentação, higiene, acessórios e brinquedos selecionados com carinho para o seu melhor amigo.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Peti — O Melhor para o Seu Pet",
    description: "Loja premium de produtos para pets. Qualidade e carinho em cada produto.",
    type: "website",
    locale: "pt_BR",
  },
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
