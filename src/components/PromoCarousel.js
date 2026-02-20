"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "./ProductImage";

export default function PromoCarousel({ items }) {
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState(1);

    if (!items || items.length === 0) return null;

    const current = items[idx];

    const getImg = (p) =>
        p.images && p.images.length > 0
            ? p.images[0]
            : p.imageUrl || "";

    const parsePrice = (str) =>
        parseFloat((str || "0").replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    const discountPct =
        current.isPromotion && current.promotionPrice
            ? Math.round(
                (1 - parsePrice(current.promotionPrice) / parsePrice(current.price)) * 100
            )
            : 0;

    const prev = () => {
        setDir(-1);
        setIdx((i) => (i - 1 + items.length) % items.length);
    };

    const next = () => {
        setDir(1);
        setIdx((i) => (i + 1) % items.length);
    };

    const goTo = (i) => {
        setDir(i > idx ? 1 : -1);
        setIdx(i);
    };

    return (
        <div className="relative w-full max-w-[850px]">
            <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                    key={idx}
                    custom={dir}
                    initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative bg-white p-6 md:p-8 rounded-[3rem] w-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row gap-8 items-stretch"
                >
                    {/* Badge de desconto */}
                    {discountPct > 0 && (
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-20 md:h-20 bg-[#52B56A] rounded-full shadow-xl flex items-center justify-center font-black text-lg md:text-xl text-white z-20"
                        >
                            -{discountPct}%
                        </motion.div>
                    )}

                    {/* Imagem */}
                    <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-square rounded-[2rem] overflow-hidden shrink-0 bg-gray-50">
                        <ProductImage
                            src={getImg(current)}
                            alt={current.title}
                            fill
                            size={320}
                            className="object-cover object-center"
                        />
                    </div>

                    {/* Info */}
                    <div className="w-full md:w-7/12 flex flex-col justify-between pt-2 pb-2">
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                <h3 className="font-extrabold text-3xl md:text-4xl leading-tight text-[#141414]">
                                    {current.title}
                                </h3>
                                <div className="text-left md:text-right shrink-0 mt-1 md:mt-2">
                                    <span className="block text-3xl font-black text-[#52B56A]">
                                        {current.isPromotion && current.promotionPrice
                                            ? current.promotionPrice
                                            : current.price}
                                    </span>
                                    {current.isPromotion && current.promotionPrice && (
                                        <span className="text-sm line-through text-gray-400">
                                            {current.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 md:mb-4 lg:pr-8 line-clamp-3">
                                {current.description ||
                                    "Produto selecionado com carinho para o seu pet."}
                            </p>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-4 mt-auto">
                            <Link
                                href={
                                    current.id && current.id.startsWith("fallback")
                                        ? "/catalogo"
                                        : `/catalogo/${current.id}`
                                }
                                className="flex items-center justify-center gap-2 text-white font-bold bg-[#141414] hover:bg-black px-6 md:px-8 py-3 md:py-3.5 rounded-full transition-all text-xs md:text-sm shadow-xl"
                            >
                                Ver Produto <ArrowRight size={16} />
                            </Link>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={prev}
                                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 text-gray-400 bg-white hover:text-black hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 text-black hover:text-white bg-white hover:bg-[#52B56A] transition-all shadow-sm hover:shadow-[0_4px_14px_0_rgba(82,181,106,0.5)] hover:-translate-y-1"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots de paginação */}
            {items.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === idx
                                ? "w-6 bg-[#52B56A]"
                                : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
