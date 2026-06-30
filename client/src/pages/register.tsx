import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useLocation, Link } from "wouter";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { full_name: nome, name: nome } },
      });

      if (signUpError) throw signUpError;
      if (data.session) setLocation("/dashboard");
      else if (data.user) setLocation("/");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
      fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F9F5"
    }} className="ev-auth-split">
      {/* Lado esquerdo — visual */}
      <div className="ev-auth-left" style={{
        background: "#1A2410", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "40px 48px", position: "relative", overflow: "hidden"
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(45,106,31,0.25)" }} />
        <div style={{ position: "absolute", bottom: "80px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(168,217,156,0.08)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#2D6A1F"/>
            <path d="M10 22 Q16 8 22 22" stroke="#A8D99C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M16 16 Q20 10 24 14" stroke="#F7F9F5" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>EcoValor</span>
        </div>

        {/* Conteúdo central */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(168,217,156,0.15)", borderRadius: "100px",
            padding: "6px 14px", marginBottom: "24px"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A8D99C", display: "inline-block" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#A8D99C", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Economia Circular
            </span>
          </div>

          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "16px" }}>
            Resíduo de um.<br />
            <span style={{ color: "#A8D99C" }}>Oportunidade</span><br />
            de outro.
          </h2>
          <p style={{ color: "#4A6040", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "340px" }}>
            Junte-se a mais de 450 empresas que já transformam resíduos industriais em receita e impacto ambiental positivo.
          </p>

          {/* Métricas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "36px" }}>
            {[
              { n: "2.5M", label: "kg reciclados" },
              { n: "1.2K", label: "ton CO₂ evitado" },
              { n: "R$8.5M", label: "economia gerada" },
              { n: "450+", label: "empresas ativas" },
            ].map(m => (
              <div key={m.label} style={{
                background: "rgba(255,255,255,0.05)", borderRadius: "12px",
                padding: "16px", border: "1px solid rgba(255,255,255,0.07)"
              }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#A8D99C", letterSpacing: "-0.02em" }}>{m.n}</div>
                <div style={{ fontSize: "0.75rem", color: "#4A6040", marginTop: "2px" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé lateral */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.78rem", color: "#2D3D24" }}>© 2026 EcoValor • Todos os direitos reservados</p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="ev-auth-right" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1A2410", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              Criar sua conta
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#7A9870" }}>
              Já tem conta?{" "}
              <Link href="/login" style={{ color: "#2D6A1F", fontWeight: 600, textDecoration: "none" }}>
                Fazer login
              </Link>
            </p>
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px",
              padding: "12px 16px", marginBottom: "20px", fontSize: "0.85rem", color: "#DC2626"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Nome completo", type: "text", placeholder: "Ex: João Silva", value: nome, set: setNome },
              { label: "E-mail", type: "email", placeholder: "contato@empresa.com.br", value: email, set: setEmail },
              { label: "Senha", type: "password", placeholder: "Mínimo 6 caracteres", value: senha, set: setSenha },
              { label: "Confirmar senha", type: "password", placeholder: "Repita a senha", value: confirmarSenha, set: setConfirmarSenha },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A2410", marginBottom: "6px", letterSpacing: "0.01em" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  style={{
                    display: "block", width: "100%", boxSizing: "border-box",
                    border: "1.5px solid #D6E4CE", borderRadius: "10px",
                    padding: "11px 14px", fontSize: "0.9rem", color: "#1A2410",
                    background: "#fff", outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#D6E4CE")}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px", width: "100%", padding: "13px",
                background: loading ? "#7A9870" : "#2D6A1F", color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "0.95rem",
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s", letterSpacing: "0.01em"
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = "#245518"; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = "#2D6A1F"; }}
            >
              {loading ? "Criando conta..." : "Criar conta gratuita →"}
            </button>
          </form>

          <p style={{ fontSize: "0.78rem", color: "#A8B8A0", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
            Ao cadastrar, você concorda com nossos{" "}
            <a href="#" style={{ color: "#2D6A1F", textDecoration: "none" }}>Termos de Uso</a>
            {" "}e{" "}
            <a href="#" style={{ color: "#2D6A1F", textDecoration: "none" }}>Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
}