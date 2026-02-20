import { Facebook, Twitter, Instagram, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#141414] text-white py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <div className="relative w-12 h-12 filter drop-shadow-sm hover:scale-105 transition-transform">
                            <Image src="/logoPeti.svg" alt="Peti logo" fill className="object-contain" />
                        </div>
                        <span className="font-extrabold text-white text-3xl md:text-4xl tracking-tighter drop-shadow-sm" style={{ fontFamily: 'var(--font-quicksand)' }}>Peti.</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 by Brayan Amaral</p>
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm font-medium">
                    <Link href="/" className="hover:text-[#52B56A] transition-colors">Início</Link>
                    <Link href="/sobre" className="hover:text-[#52B56A] transition-colors">Sobre Nós</Link>
                    <Link href="/catalogo" className="hover:text-[#52B56A] transition-colors">Catálogo</Link>
                    <Link href="/contato" className="hover:text-[#52B56A] transition-colors">Contato</Link>
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                    <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Globe size={18} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
                </div>
            </div>
        </footer>
    );
}
