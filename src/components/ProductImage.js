"use client";

import Image from "next/image";

/**
 * Renderiza a imagem de um produto de forma segura e consistente:
 * - Firebase Storage → next/image (otimizado)
 * - URL externa     → <img> nativo (sem restrição de host)
 * - Vazio / null    → placeholder com ícone de pata roxa
 *
 * Props:
 *  src       string   – URL da imagem (pode ser vazia/nula)
 *  alt       string   – texto alternativo
 *  fill      boolean  – usa layout fill do next/image (precisa de pai relative)
 *  className string   – classes extras
 *  size      number   – tamanho em px para o placeholder (default 64)
 *  padding   string   – classe de padding extra (ex: "p-6")
 *  blendMultiply boolean – aplica mix-blend-multiply (útil em fundo branco)
 */
export default function ProductImage({
    src,
    alt = "",
    fill = false,
    className = "",
    size = 64,
    padding = "",
    blendMultiply = false,
}) {
    const blendClass = blendMultiply ? "mix-blend-multiply" : "";

    // ── Sem imagem → placeholder bonito ─────────────────────────────────────
    if (!src || src.trim() === "") {
        const svgSize = Math.max(size * 0.45, 28);
        return (
            <div
                style={fill ? undefined : { width: size, height: size }}
                className={`
          ${fill ? "absolute inset-0" : ""}
          bg-gradient-to-br from-purple-50 to-pink-50
          flex flex-col items-center justify-center gap-1.5
          ${className}
        `}
            >
                {/* Ícone de pata */}
                <svg
                    width={svgSize}
                    height={svgSize}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Palma */}
                    <ellipse cx="20" cy="28" rx="10" ry="7.5" fill="#e9d5ff" />
                    {/* Dedos */}
                    <circle cx="9" cy="14" r="5.5" fill="#d8b4fe" />
                    <circle cx="31" cy="14" r="5.5" fill="#d8b4fe" />
                    <circle cx="14" cy="8" r="4.5" fill="#d8b4fe" />
                    <circle cx="26" cy="8" r="4.5" fill="#d8b4fe" />
                </svg>
                {size > 56 && (
                    <span
                        style={{ fontSize: Math.max(size * 0.12, 10) }}
                        className="text-purple-300 font-bold select-none"
                    >
                        sem foto
                    </span>
                )}
            </div>
        );
    }

    const isFirebase = src.includes("firebasestorage.googleapis.com");

    // ── Firebase Storage → next/image ────────────────────────────────────────
    if (isFirebase) {
        return fill ? (
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-contain ${padding} ${blendClass} ${className}`}
            />
        ) : (
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={`object-contain ${padding} ${blendClass} ${className}`}
            />
        );
    }

    // ── URL externa → <img> nativo ────────────────────────────────────────────
    /* eslint-disable @next/next/no-img-element */
    return (
        <img
            src={src}
            alt={alt}
            style={
                fill
                    ? { width: "100%", height: "100%", objectFit: "contain" }
                    : { width: size, height: size, objectFit: "contain" }
            }
            className={`${padding} ${blendClass} ${className}`}
            onError={(e) => {
                // Se a URL está quebrada, esconde e mostra o placeholder via parent
                const el = e.currentTarget;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent && !parent.querySelector(".peti-placeholder")) {
                    const ph = document.createElement("div");
                    ph.className =
                        "peti-placeholder absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center";
                    ph.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="20" cy="28" rx="10" ry="7.5" fill="#e9d5ff"/>
              <circle cx="9" cy="14" r="5.5" fill="#d8b4fe"/>
              <circle cx="31" cy="14" r="5.5" fill="#d8b4fe"/>
              <circle cx="14" cy="8" r="4.5" fill="#d8b4fe"/>
              <circle cx="26" cy="8" r="4.5" fill="#d8b4fe"/>
            </svg>`;
                    parent.style.position = "relative";
                    parent.appendChild(ph);
                }
            }}
        />
    );
    /* eslint-enable @next/next/no-img-element */
}
