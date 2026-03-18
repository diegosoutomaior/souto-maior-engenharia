"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 text-center">
        <div className="h-14 w-14 rounded-xl bg-status-success/10 flex items-center justify-center mx-auto mb-5">
          <span className="text-status-success font-bold text-lg">✓</span>
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Conta criada!
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Verifique seu e-mail para confirmar o cadastro.
        </p>
        <Link href="/login">
          <Button className="bg-brand-500 hover:bg-brand-600">
            Ir para login
          </Button>
        </Link>
      </div>
    );
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

      <div className="text-center mb-6">
        <h2 className="text-base font-semibold text-zinc-800">
          Criar conta
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Preencha os dados para começar
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Criar Conta
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs text-zinc-400">ou</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      <Link href="/login" className="block">
        <Button variant="outline" className="w-full h-11">
          Já tenho conta
        </Button>
      </Link>
    </div>
  );
}