"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import PawButton from './PawButton';
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from '../lib/firebase';
import { LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contato", label: "Contato" },
];

// ── Linha animada do hambúrguer ───────────────────────────────────────────────
function HamburgerLine({ rotate, translateY, opacity, originX = "50%" }) {
  return (
    <motion.span
      animate={{ rotate, translateY, opacity, originX }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="block absolute left-0 right-0 h-[2.5px] bg-[#141414] rounded-full"
    />
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu ao trocar de rota
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Bloqueia scroll do body quando menu está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  const isFullWidthRoute = pathname?.startsWith('/admin') ||
    (pathname?.startsWith('/catalogo/') && pathname.split('/').length > 2);

  const transformContainerTop = useTransform(scrollY, [0, 350], ["1.5rem", "0rem"]);
  const transformContainerPadding = useTransform(scrollY, [0, 350], ["1.5rem", "0rem"]);
  const transformNavMaxWidth = useTransform(scrollY, [0, 350], ["1280px", "4000px"]);
  const transformNavBorderRadius = useTransform(scrollY, [0, 350], ["50px", "0px"]);
  const transformNavPy = useTransform(scrollY, [0, 350], ["1rem", "1.25rem"]);
  const transformNavPx = useTransform(scrollY, [0, 350], ["2rem", "3rem"]);
  const transformNavBg = useTransform(scrollY, [0, 350], ["rgba(255,255,255,0.65)", "rgba(255,255,255,0.98)"]);
  const transformNavShadow = useTransform(scrollY, [0, 350], ["0px 10px 40px -10px rgba(0,0,0,0.1)", "0px 4px 20px -2px rgba(0,0,0,0.15)"]);
  const transformNavBorderColor = useTransform(scrollY, [0, 350], ["rgba(0,0,0,0.06)", "rgba(0,0,0,0.08)"]);
  const transformFirstLinkColor = useTransform(scrollY, [0, 350], ["#141414", "#4b5563"]);

  const containerTop = isFullWidthRoute ? "0rem" : transformContainerTop;
  const containerPad = isFullWidthRoute ? "0rem" : transformContainerPadding;
  const navMaxWidth = isFullWidthRoute ? "4000px" : transformNavMaxWidth;
  const navBorderRadius = isFullWidthRoute ? "0px" : transformNavBorderRadius;
  const navPy = isFullWidthRoute ? "1.25rem" : transformNavPy;
  const navPx = isFullWidthRoute ? "3rem" : transformNavPx;
  const navBg = isFullWidthRoute ? "rgba(255,255,255,0.98)" : transformNavBg;
  const navShadow = isFullWidthRoute ? "0px 4px 20px -2px rgba(0,0,0,0.15)" : transformNavShadow;
  const navBorderColor = isFullWidthRoute ? "rgba(0,0,0,0.08)" : transformNavBorderColor;
  const firstLinkColor = isFullWidthRoute ? "#4b5563" : transformFirstLinkColor;

  // Variantes das 3 linhas do hambúrguer → X criativo
  const line1 = { rotate: menuOpen ? 45 : 0, translateY: menuOpen ? 8 : 0, opacity: 1 };
  const line2 = { rotate: 0, translateY: 0, opacity: menuOpen ? 0 : 1 };
  const line3 = { rotate: menuOpen ? -45 : 0, translateY: menuOpen ? -8 : 0, opacity: 1 };

  return (
    <>
      <motion.div
        className="fixed w-full z-[100]"
        style={{ top: containerTop, paddingLeft: containerPad, paddingRight: containerPad }}
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
          {/* ── Logo (linkada para home) ────────────────────── */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative w-12 h-12 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-6deg]">
              <Image src="/logoPeti.svg" alt="Peti logo" fill className="object-contain drop-shadow-sm" />
            </div>
            <span
              className="font-extrabold text-[#141414] text-3xl md:text-4xl tracking-tighter drop-shadow-sm group-hover:text-[#a855f7] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-quicksand)' }}
            >
              Peti.
            </span>
          </Link>

          {/* ── Links desktop ───────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-12 text-base font-semibold text-gray-500">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link href={href} className="cursor-pointer font-semibold block">
                  <motion.span
                    style={i === 0 ? { color: firstLinkColor } : {}}
                    whileHover={{ color: "#52B56A" }}
                    className="transition-colors inline-block"
                  >
                    {label}
                  </motion.span>
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-full bg-purple-50 text-[#a855f7] font-bold hover:bg-purple-100 transition-colors border border-purple-100 shadow-sm text-xs tracking-widest uppercase">
                  ⚙️ Admin
                </Link>
              </li>
            )}
          </ul>

          {/* ── Direita: CTA + Hambúrguer ───────────────────── */}
          <div className="flex items-center gap-3">
            {/* CTA desktop */}
            <div className="hidden md:block">
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

            {/* Hambúrguer mobile */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm z-[110] shrink-0"
              whileTap={{ scale: 0.88 }}
              aria-label="Menu"
            >
              <div className="relative w-5 h-4">
                <motion.span animate={line1} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="block absolute top-0 left-0 right-0 h-[2.5px] bg-[#141414] rounded-full origin-center" />
                <motion.span animate={line2} transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block absolute top-[7px] left-0 right-0 h-[2.5px] bg-[#141414] rounded-full" />
                <motion.span animate={line3} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="block absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#141414] rounded-full origin-center" />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </motion.div>

      {/* ── Menu mobile overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop com blur */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Painel deslizante */}
            <motion.div
              key="panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-[105] md:hidden
                         bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col
                         border-l border-gray-100"
            >
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/60 to-pink-50/40 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/50 to-transparent rounded-full blur-3xl -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3" />

              {/* Topo do painel */}
              <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                  <div className="relative w-9 h-9">
                    <Image src="/logoPeti.svg" alt="Peti" fill className="object-contain" />
                  </div>
                  <span className="font-extrabold text-2xl text-[#141414] tracking-tighter" style={{ fontFamily: 'var(--font-quicksand)' }}>
                    Peti.
                  </span>
                </Link>

                {/* Botão fechar em X */}
                <motion.button
                  onClick={() => setMenuOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.25 }}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#a855f7]/10 flex items-center justify-center text-gray-500 hover:text-[#a855f7] transition-colors"
                  aria-label="Fechar menu"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>

              {/* Links com stagger */}
              <nav className="flex flex-col gap-1 px-5 py-6 flex-grow">
                {NAV_LINKS.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-lg transition-all duration-200
                        ${pathname === href
                          ? "bg-[#a855f7]/10 text-[#a855f7]"
                          : "text-[#141414] hover:bg-gray-50 hover:text-[#52B56A]"
                        }`}
                    >
                      <span>{label}</span>
                      <motion.svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: pathname === href ? 0 : 0 }}
                        whileHover={{ x: 3 }}
                      >
                        <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: 0.06 * NAV_LINKS.length, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-[#a855f7] bg-purple-50 border border-purple-100 tracking-widest uppercase hover:bg-purple-100 transition-colors"
                    >
                      ⚙️ Admin
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Rodapé do painel: CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="px-8 pb-10 pt-4 border-t border-gray-100 flex flex-col gap-3"
              >
                {pathname?.startsWith('/admin/dashboard') ? (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors text-sm border border-red-100"
                  >
                    Sair <LogOut size={16} />
                  </button>
                ) : (
                  <PawButton href="/catalogo" variant="primary" className="w-full justify-center py-4 text-base" onClick={() => setMenuOpen(false)}>
                    Ver Produtos 🛍️
                  </PawButton>
                )}
                <p className="text-center text-xs text-gray-400 font-medium mt-1">
                  O Melhor para o Seu Pet 🐾
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
