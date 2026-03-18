"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
      {/* Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-14 w-14 rounded-xl bg-brand-500 flex items-center justify-center mb-5 shadow-sm">
          <span className="text-white font-bold text-lg">SM</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-brand uppercase">
          Souto Maior
        </h1>
        <p className="text-[11px] font-medium text-zinc-400 tracking-widest uppercase mt-0.5">
          Engenharia
        </p>
      </div>

      {/* Título */}
      <div className="text-center mb-6">
        <h2 className="text-base font-semibold text-zinc-800">
          Acesse sua conta
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Insira suas credenciais para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="text-sm text-status-critical bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 h-11"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400">ou</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Link para registro */}
      <Link href="/registro" className="block">
        <Button variant="outline" className="w-full h-11">
          Criar nova conta
        </Button>
      </Link>
    </div>
  );
}