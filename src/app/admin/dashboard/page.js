"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    Plus, Trash2, Image as ImageIcon, Sparkles, Edit2, X, Images,
    Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2,
    ChevronDown, ChevronUp, PackagePlus
} from "lucide-react";
import PawButton from "../../../components/PawButton";
import ProductImage from "../../../components/ProductImage";


// ─── Cabeçalhos esperados no CSV ─────────────────────────────────────────────
const CSV_HEADERS = ["titulo", "descricao", "categoria", "preco", "preco_promocional", "em_promocao", "url_imagem"];
const VALID_CATEGORIES = ["Alimentação", "Higiene", "Acessórios", "Brinquedos"];

function parseCsv(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length < 2) return { rows: [], error: "O arquivo está vazio ou sem dados." };

    // Detectar delimitador (vírgula ou ponto e vírgula)
    const delim = lines[0].includes(";") ? ";" : ",";

    const parseLine = (line) => {
        const result = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQuotes = !inQuotes; continue; }
            if (ch === delim && !inQuotes) { result.push(current.trim()); current = ""; continue; }
            current += ch;
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/\s/g, "_"));
    const missingHeaders = CSV_HEADERS.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
        return { rows: [], error: `Colunas faltando: ${missingHeaders.join(", ")}` };
    }

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => { row[h] = vals[idx] || ""; });
        rows.push({ ...row, _line: i + 1 });
    }
    return { rows, error: null };
}

function validateRow(row) {
    const errors = [];
    if (!row.titulo?.trim()) errors.push("Título obrigatório");
    if (!row.preco?.trim()) errors.push("Preço obrigatório");
    const cat = VALID_CATEGORIES.find((c) => c.toLowerCase() === row.categoria?.toLowerCase().trim());
    if (!cat) errors.push(`Categoria inválida (use: ${VALID_CATEGORIES.join(", ")})`);
    const isPromo = row.em_promocao?.toLowerCase().trim() === "sim";
    if (isPromo && !row.preco_promocional?.trim()) errors.push("Preço promocional obrigatório quando em promoção");
    return { errors, isPromo, category: cat || "Alimentação" };
}

// ─── Componente de Importação ─────────────────────────────────────────────────
function ImportSection({ onImportDone }) {
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [parseError, setParseError] = useState(null);
    const [fileName, setFileName] = useState("");
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState(null); // { ok, failed }
    const fileRef = useRef();

    const reset = () => { setRows([]); setParseError(null); setFileName(""); setResults(null); if (fileRef.current) fileRef.current.value = ""; };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        setResults(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const { rows: parsed, error } = parseCsv(ev.target.result);
            if (error) { setParseError(error); setRows([]); }
            else { setParseError(null); setRows(parsed); }
        };
        reader.readAsText(file, "UTF-8");
    };

    const handleImport = async () => {
        if (rows.length === 0) return;
        setImporting(true);
        let ok = 0, failed = 0;
        const failures = [];
        for (const row of rows) {
            const { errors, isPromo, category } = validateRow(row);
            if (errors.length > 0) { failed++; failures.push({ line: row._line, title: row.titulo, errors }); continue; }
            try {
                const imgUrl = row.url_imagem?.trim() || "";
                await addDoc(collection(db, "produtos"), {
                    title: row.titulo.trim(),
                    description: row.descricao?.trim() || "",
                    price: row.preco.trim(),
                    category,
                    isPromotion: isPromo,
                    promotionPrice: isPromo ? row.preco_promocional.trim() : "",
                    images: imgUrl ? [imgUrl] : [],
                    imageUrl: imgUrl,
                    createdAt: new Date(),
                });
                ok++;
            } catch {
                failed++;
                failures.push({ line: row._line, title: row.titulo, errors: ["Erro ao salvar no banco"] });
            }
        }
        setResults({ ok, failed, failures });
        setImporting(false);
        if (ok > 0) onImportDone();
    };

    const validatedRows = rows.map((r) => ({ ...r, validation: validateRow(r) }));
    const hasErrors = validatedRows.some((r) => r.validation.errors.length > 0);

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            {/* Header clicável */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                        <PackagePlus size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-bold text-[#141414]">Importar Produtos em Massa</h2>
                        <p className="text-xs text-gray-400 font-medium">Faça upload de um arquivo CSV e cadastre vários produtos de uma vez</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/modelo-importacao-produtos.csv"
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-full transition-colors"
                    >
                        <Download size={13} />
                        Modelo CSV
                    </a>
                    {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
            </button>

            {open && (
                <div className="px-8 pb-8 border-t border-gray-50">
                    {/* Drop zone */}
                    <label className="mt-6 flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-gray-200 hover:border-emerald-400 bg-gray-50 hover:bg-emerald-50/50 rounded-2xl py-10 cursor-pointer transition-all group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-emerald-200 transition-colors">
                            {fileName ? <FileText size={24} className="text-emerald-500" /> : <Upload size={24} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-700 text-sm">{fileName || "Clique ou arraste seu arquivo CSV aqui"}</p>
                            <p className="text-xs text-gray-400 mt-1">{fileName ? "Clique para trocar o arquivo" : "Somente arquivos .csv são aceitos"}</p>
                        </div>
                        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
                    </label>

                    {/* Erro de parse */}
                    {parseError && (
                        <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <div><strong>Erro no arquivo:</strong> {parseError}</div>
                        </div>
                    )}

                    {/* Preview dos dados */}
                    {validatedRows.length > 0 && !results && (
                        <div className="mt-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-gray-700">{validatedRows.length} produto{validatedRows.length !== 1 ? "s" : ""} encontrado{validatedRows.length !== 1 ? "s" : ""}</p>
                                {hasErrors && <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Alguns itens têm erros</span>}
                            </div>
                            <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="max-h-72 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Ln</th>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Título</th>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Categoria</th>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Preço</th>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Promo?</th>
                                                <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {validatedRows.map((row, i) => {
                                                const hasErr = row.validation.errors.length > 0;
                                                return (
                                                    <tr key={i} className={hasErr ? "bg-red-50/50" : "bg-white hover:bg-gray-50"}>
                                                        <td className="px-4 py-3 text-gray-400">{row._line}</td>
                                                        <td className="px-4 py-3 font-semibold text-gray-700 max-w-[180px] truncate">{row.titulo || <span className="text-gray-300 italic">vazio</span>}</td>
                                                        <td className="px-4 py-3 text-gray-500">{row.validation.category}</td>
                                                        <td className="px-4 py-3 font-bold text-[#52B56A]">{row.preco}</td>
                                                        <td className="px-4 py-3">
                                                            {row.validation.isPromo
                                                                ? <span className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">Sim</span>
                                                                : <span className="text-gray-300 text-[10px]">—</span>}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {hasErr
                                                                ? <span title={row.validation.errors.join(" | ")} className="flex items-center gap-1 text-red-500 font-bold cursor-help">
                                                                    <AlertCircle size={12} /> Erro
                                                                </span>
                                                                : <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                                                    <CheckCircle2 size={12} /> OK
                                                                </span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={handleImport}
                                    disabled={importing || validatedRows.every((r) => r.validation.errors.length > 0)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {importing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    {importing ? "Importando..." : `Importar ${validatedRows.filter((r) => r.validation.errors.length === 0).length} produto${validatedRows.filter((r) => r.validation.errors.length === 0).length !== 1 ? "s" : ""}`}
                                </button>
                                <button type="button" onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors flex items-center gap-1">
                                    <X size={14} /> Limpar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Resultado da importação */}
                    {results && (
                        <div className="mt-5 space-y-3">
                            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${results.ok > 0 ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
                                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Importação concluída!</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        <span className="font-bold text-emerald-600">{results.ok} produto{results.ok !== 1 ? "s" : ""}</span> cadastrado{results.ok !== 1 ? "s" : ""} com sucesso
                                        {results.failed > 0 && <>, <span className="font-bold text-red-500">{results.failed} falhou{results.failed !== 1 ? "am" : ""}</span></>}
                                    </p>
                                </div>
                            </div>
                            {results.failures?.length > 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Erros detectados:</p>
                                    {results.failures.map((f, i) => (
                                        <div key={i} className="text-xs text-red-700">
                                            <span className="font-bold">Ln {f.line} — {f.title || "sem título"}:</span> {f.errors.join("; ")}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button type="button" onClick={reset} className="text-sm text-emerald-600 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1">
                                <Plus size={14} /> Importar outro arquivo
                            </button>
                        </div>
                    )}

                    {/* Dicas */}
                    {!rows.length && !parseError && (
                        <div className="mt-6 bg-gray-50 rounded-2xl p-5">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Como usar</p>
                            <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-500 font-medium">
                                <li>Baixe o <strong>Modelo CSV</strong> acima e abra no Excel ou Google Sheets</li>
                                <li>Preencha uma linha por produto (não apague os cabeçalhos)</li>
                                <li>Para <strong>em_promocao</strong> use <code className="bg-gray-200 px-1 rounded">sim</code> ou <code className="bg-gray-200 px-1 rounded">não</code></li>
                                <li>Categorias válidas: <strong>{VALID_CATEGORIES.join(", ")}</strong></li>
                                <li>A coluna <strong>url_imagem</strong> pode ficar vazia — você poderá editar o produto depois</li>
                                <li>Salve como <strong>.csv (separado por vírgulas)</strong> e faça o upload aqui</li>
                            </ol>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Dashboard Principal ──────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Alimentação");
    const [isPromotion, setIsPromotion] = useState(false);
    const [promotionPrice, setPromotionPrice] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (!loading && !user) router.push("/admin");
    }, [user, loading, router]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        const querySnapshot = await getDocs(collection(db, "produtos"));
        const prods = [];
        querySnapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() }));
        setProducts(prods);
        setLoadingProducts(false);
    };

    useEffect(() => {
        if (user) fetchProducts();
    }, [user]);

    const clearForm = () => {
        setTitle(""); setDescription(""); setPrice(""); setCategory("Alimentação");
        setIsPromotion(false); setPromotionPrice(""); setImageFiles([]); setCurrentImages([]); setEditingId(null);
    };

    const handleAddImageFiles = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!title || !price) return alert("Preencha título e preço.");

        try {
            setUploading(true);
            const newUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
                    const uploadTask = await uploadBytesResumable(storageRef, file);
                    return await getDownloadURL(uploadTask.ref);
                })
            );
            const allImages = [...currentImages, ...newUrls];
            const imageUrl = allImages[0] || "";

            if (editingId) {
                await updateDoc(doc(db, "produtos", editingId), {
                    title, description, price, category, isPromotion,
                    promotionPrice: isPromotion ? promotionPrice : "",
                    images: allImages, imageUrl,
                });
            } else {
                await addDoc(collection(db, "produtos"), {
                    title, description, price, category,
                    isPromotion: false, promotionPrice: "",
                    images: allImages, imageUrl,
                    createdAt: new Date(),
                });
            }

            clearForm();
            fetchProducts();
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar produto. Verifique o console.");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (prod) => {
        setEditingId(prod.id); setTitle(prod.title); setDescription(prod.description || "");
        setPrice(prod.price); setCategory(prod.category || "Alimentação");
        setIsPromotion(prod.isPromotion || false); setPromotionPrice(prod.promotionPrice || "");
        setCurrentImages(prod.images || (prod.imageUrl ? [prod.imageUrl] : []));
        setImageFiles([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            await deleteDoc(doc(db, "produtos", id));
            fetchProducts();
        }
    };

    const getFirstImage = (prod) => {
        if (prod.images && prod.images.length > 0) return prod.images[0];
        return prod.imageUrl || "";
    };

    if (loading || !user) return <div className="min-h-screen bg-[#FCFBFF] flex items-center justify-center font-bold text-[#a855f7]">Verificando Cofre...</div>;

    return (
        <main className="min-h-screen relative bg-[#FCFBFF] px-6 pt-32 pb-20">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Importação em Massa */}
                <ImportSection onImportDone={fetchProducts} />

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Formulário individual */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#141414] flex items-center gap-2">
                                    {editingId ? <Edit2 size={20} className="text-[#a855f7]" /> : <Sparkles size={20} className="text-[#a855f7]" />}
                                    {editingId ? "Editar Item" : "Novo Item"}
                                </h2>
                                {editingId && (
                                    <button onClick={clearForm} className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                                        <X size={14} /> Cancelar
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Nome do Produto</label>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none focus:bg-purple-50 focus:text-[#a855f7] transition-colors font-medium text-gray-600 text-sm" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Categoria</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none focus:bg-purple-50 focus:text-[#a855f7] transition-colors font-medium text-gray-600 text-sm">
                                            {VALID_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Preço</label>
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none focus:bg-purple-50 focus:text-[#a855f7] transition-colors font-medium text-gray-600 text-sm" placeholder="R$ 0,00" required />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Descrição</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-gray-50 px-5 py-3 rounded-xl outline-none focus:bg-purple-50 focus:text-[#a855f7] transition-colors font-medium text-gray-600 text-sm resize-none"></textarea>
                                </div>

                                {editingId && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Promoção</label>
                                        <div className="flex flex-col gap-3 bg-gray-50 px-5 py-4 rounded-xl">
                                            <label className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors w-full rounded-md p-1">
                                                <input type="checkbox" checked={isPromotion} onChange={(e) => setIsPromotion(e.target.checked)} className="w-5 h-5 accent-[#a855f7]" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">Destacar como Promoção</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">Aparece no carrossel da home</span>
                                                </div>
                                            </label>
                                            {isPromotion && (
                                                <div className="flex flex-col gap-1 pt-2 border-t border-gray-200">
                                                    <label className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest pl-1">Valor Promocional</label>
                                                    <input value={promotionPrice} onChange={(e) => setPromotionPrice(e.target.value)} type="text" className="w-full bg-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 font-bold text-[#a855f7] text-sm border-2 border-dashed border-purple-200" placeholder="R$ 0,00" required={isPromotion} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Imagens */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-1">
                                        <Images size={12} /> Fotos ({currentImages.length + imageFiles.length})
                                    </label>
                                    {currentImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {currentImages.map((url, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                    <ProductImage src={url} alt={`Imagem ${idx + 1}`} fill className="object-cover" />
                                                    <button type="button" onClick={() => setCurrentImages((p) => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"><X size={12} /></button>
                                                    {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">CAPA</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {imageFiles.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {imageFiles.map((file, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-purple-200 bg-purple-50">
                                                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setImageFiles((p) => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"><X size={12} /></button>
                                                    <span className="absolute bottom-1 left-1 bg-[#a855f7]/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">NOVO</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <label className="w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#a855f7] hover:bg-purple-50 transition-colors rounded-xl px-5 py-4 flex items-center justify-center cursor-pointer group gap-2">
                                        <ImageIcon size={18} className="text-gray-400 group-hover:text-[#a855f7] transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500 group-hover:text-[#a855f7]">
                                            {currentImages.length + imageFiles.length > 0 ? "Adicionar mais fotos" : "Selecionar fotos"}
                                        </span>
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleAddImageFiles} />
                                    </label>
                                </div>

                                <PawButton variant="purple" className="w-full py-4 justify-center mt-2 group" disabled={uploading}>
                                    {uploading ? "Salvando..." : (editingId ? "Atualizar Produto" : "Adicionar ao Catálogo")}
                                    {!editingId && <Plus size={18} className="ml-2 group-hover:rotate-90 transition-transform" />}
                                </PawButton>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px]">
                            <h2 className="text-xl font-bold text-[#141414] mb-6">Produtos Ativos ({products.length})</h2>
                            {loadingProducts ? (
                                <div className="flex items-center gap-2 text-gray-400 font-medium"><Loader2 size={16} className="animate-spin" /> Lendo prateleiras...</div>
                            ) : products.length === 0 ? (
                                <div className="text-gray-400 font-medium bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                                    O catálogo está vazio. Que tal adicionar o primeiro produto mágico?
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {products.map((prod) => (
                                        <div key={prod.id} className="flex items-center justify-between p-4 bg-[#FCFBFF] border border-gray-100 rounded-2xl hover:border-[#a855f7]/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 shrink-0">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden relative shadow-sm border border-gray-100">
                                                        <ProductImage
                                                            src={prod.images?.[0] || prod.imageUrl || ""}
                                                            alt={prod.title}
                                                            fill
                                                            size={64}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    {prod.images?.length > 1 && (
                                                        <span className="absolute -bottom-1 -right-1 bg-[#a855f7] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow shadow-purple-200 border-2 border-white">{prod.images.length}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#52B56A] uppercase tracking-widest flex items-center gap-2">
                                                        {prod.category}
                                                        {prod.isPromotion && <span className="bg-orange-100 text-orange-500 px-2 py-0.5 rounded-md text-[8px] flex items-center gap-1 font-black"><Sparkles size={10} /> DESTAQUE</span>}
                                                    </p>
                                                    <h4 className="font-bold text-[#141414]">{prod.title}</h4>
                                                    {prod.isPromotion && prod.promotionPrice ? (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm font-extrabold text-[#a855f7]">{prod.promotionPrice}</span>
                                                            <span className="text-xs line-through text-gray-400 font-medium">{prod.price}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-extrabold text-gray-500 mt-1">{prod.price}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => handleEdit(prod)} className="w-10 h-10 rounded-full bg-white text-gray-400 hover:bg-purple-50 hover:text-[#a855f7] flex items-center justify-center transition-all shadow-sm"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(prod.id)} className="w-10 h-10 rounded-full bg-white text-gray-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all shadow-sm"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
