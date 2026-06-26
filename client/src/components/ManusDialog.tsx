import React, { useState } from "react";
import { supabase } from "../supabaseClient";

interface AccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessDialog = ({ open, onOpenChange }: AccessDialogProps) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            full_name: nome,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess("Cadastro realizado com sucesso! Verifique seu e-mail.");
      setTimeout(() => {
        onOpenChange(false);
        setSuccess("");
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative text-left">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 text-center">
            Cadastrar Novo Usuário
          </h2>
          <p className="text-xs text-gray-500 text-center">
            Crie sua conta para acessar o ecossistema EcoValor
          </p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: EcoValor Admin"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="contato@ecovalor.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm disabled:opacity-50 text-center"
          >
            {loading ? "Cadastrando..." : "Cadastrar-se"}
          </button>
        </form>
      </div>
    </div>
  );
};
