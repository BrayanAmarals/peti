"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import PawButton from './PawButton';
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from '../lib/firebase';
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  // Verifica se é rota de admin ou produto específico para fixar a navbar grande
  const isFullWidthRoute = pathname?.startsWith('/admin') || (pathname?.startsWith('/catalogo/') && pathname.split('/').length > 2);

  // Expandimos rigorosamente o limite do scroll para 350px, deixando beeeem mais lento e cadenciado
  const transformContainerTop = useTransform(scrollY, [0, 350], ["1.5rem", "0rem"]);
  const transformContainerPadding = useTransform(scrollY, [0, 350], ["1.5rem", "0rem"]);

  const transformNavMaxWidth = useTransform(scrollY, [0, 350], ["1280px", "4000px"]);
  const transformNavBorderRadius = useTransform(scrollY, [0, 350], ["50px", "0px"]);
  const transformNavPy = useTransform(scrollY, [0, 350], ["1rem", "1.25rem"]);
  const transformNavPx = useTransform(scrollY, [0, 350], ["2rem", "3rem"]);

  // Dando mais contraste dinâmico com o background do site:
  const transformNavBg = useTransform(scrollY, [0, 350], ["rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.98)"]);
  const transformNavShadow = useTransform(scrollY, [0, 350], ["0px 10px 40px -10px rgba(0,0,0,0.1)", "0px 4px 20px -2px rgba(0,0,0,0.15)"]);
  const transformNavBorderColor = useTransform(scrollY, [0, 350], ["rgba(0,0,0,0.06)", "rgba(0,0,0,0.08)"]);
  const transformFirstLinkColor = useTransform(scrollY, [0, 350], ["#141414", "#4b5563"]); // transição suave de quase-preto para cinza

  // Valores Finais Baseados na Rota
  const containerTop = isFullWidthRoute ? "0rem" : transformContainerTop;
  const containerPadding = isFullWidthRoute ? "0rem" : transformContainerPadding;
  const navMaxWidth = isFullWidthRoute ? "4000px" : transformNavMaxWidth;
  const navBorderRadius = isFullWidthRoute ? "0px" : transformNavBorderRadius;
  const navPy = isFullWidthRoute ? "1.25rem" : transformNavPy;
  const navPx = isFullWidthRoute ? "3rem" : transformNavPx;
  const navBg = isFullWidthRoute ? "rgba(255, 255, 255, 0.98)" : transformNavBg;
  const navShadow = isFullWidthRoute ? "0px 4px 20px -2px rgba(0,0,0,0.15)" : transformNavShadow;
  const navBorderColor = isFullWidthRoute ? "rgba(0,0,0,0.08)" : transformNavBorderColor;
  const firstLinkColor = isFullWidthRoute ? "#4b5563" : transformFirstLinkColor;

  return (
    <motion.div
      className="fixed w-full z-100"
      style={{
        top: containerTop,
        paddingLeft: containerPadding,
        paddingRight: containerPadding,
        zIndex: 100
      }}
    >
      <motion.nav
        className="mx-auto backdrop-blur-md flex items-center justify-between w-full border"
        style={{
          maxWidth: navMaxWidth,
          borderRadius: navBorderRadius,
          paddingTop: navPy,
          paddingBottom: navPy,
          paddingLeft: navPx,
          paddingRight: navPx,
          backgroundColor: navBg,
          boxShadow: navShadow,
          borderColor: navBorderColor,
        }}
      >
        <div className="flex items-center gap-4 cursor-pointer">
          {/* Logo */}
          <div className="relative w-12 h-12 transition-transform duration-700 ease-in-out hover:scale-105">
            <Image src="/logoPeti.svg" alt="Peti logo" fill className="object-contain drop-shadow-sm" />
          </div>
          <span className="font-extrabold text-[#141414] text-3xl md:text-4xl tracking-tighter drop-shadow-sm" style={{ fontFamily: 'var(--font-quicksand)' }}>Peti.</span>
        </div>

        <ul className="hidden md:flex items-center gap-12 text-base font-semibold text-gray-500">
          <li>
            <Link href="/" className="cursor-pointer font-semibold block">
              <motion.span
                style={{ color: firstLinkColor }}
                whileHover={{ color: "#52B56A" }}
                className="transition-colors inline-block"
              >
                Início
              </motion.span>
            </Link>
          </li>
          <li>
            <Link href="/sobre" className="hover:text-[#52B56A] transition-colors">Sobre Nós</Link>
          </li>
          <li>
            <Link href="/catalogo" className="hover:text-[#52B56A] transition-colors">Catálogo</Link>
          </li>
          <li>
            <Link href="/contato" className="hover:text-[#52B56A] transition-colors">Contato</Link>
          </li>
          {user && (
            <li>
              <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-full bg-purple-50 text-[#a855f7] font-bold hover:bg-purple-100 transition-colors border border-purple-100 shadow-sm text-xs tracking-widest uppercase">
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center">
          {pathname?.startsWith('/admin/dashboard') ? (
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors text-sm border border-red-100 shadow-sm cursor-pointer">
              Sair <LogOut size={16} />
            </button>
          ) : (
            <PawButton href="/catalogo" variant="primary" className="px-6 py-2.5 text-sm cursor-pointer">
              Ver Produtos
            </PawButton>
          )}
        </div>
      </motion.nav>
    </motion.div>
  );
}
