"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { PawPrint, Lock } from "lucide-react";
import PawButton from "../../components/PawButton";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push("/admin/dashboard");
        }
    }, [user, loading, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin/dashboard");
        } catch (err) {
            setError("Email ou senha inválidos. Tente novamente.");
        }
    };

    if (loading || user) return <div className="min-h-screen bg-[#FCFBFF] flex items-center justify-center">Carregando...</div>;

    return (
        <main className="min-h-screen relative flex items-center justify-center bg-[#FCFBFF] px-6">
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[#FCFBFF] -z-20" />
            <div className="absolute top-0 inset-x-0 h-[60vh] w-full bg-gradient-to-b from-[#e5d9f2]/30 to-transparent -z-10" />

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-[#F3E8FF] rounded-2xl flex items-center justify-center text-[#a855f7] mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-[#141414]">Acesso Restrito</h1>
                    <p className="text-gray-500 font-medium">Área de Gerenciamento Peti.</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-center font-semibold mb-6 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Email Admin</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors"
                            placeholder="admin@peti.com.br"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-2 border-transparent outline-none focus:border-[#a855f7] focus:bg-white text-gray-800 font-medium transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <PawButton variant="purple" className="w-full py-4 justify-center">
                            Entrar no Cofre
                        </PawButton>
                    </div>
                </form>
            </div>
        </main>
    );
}
