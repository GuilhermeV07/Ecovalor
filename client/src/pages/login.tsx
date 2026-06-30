import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "@/supabaseClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
      if (supabaseError) {
        setError("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }
      setLocation("/dashboard");
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
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
              Bem-vindo de volta
            </span>
          </div>

          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "16px" }}>
            Continue<br />
            <span style={{ color: "#A8D99C" }}>transformando</span><br />
            resíduos.
          </h2>
          <p style={{ color: "#4A6040", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "340px" }}>
            Acesse seu painel e gerencie seus resíduos, acompanhe métricas ESG e explore o marketplace.
          </p>

          {/* Destaques */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "36px" }}>
            {[
              { icon: "📊", text: "Dashboard com KPIs em tempo real" },
              { icon: "🛒", text: "Marketplace de resíduos industriais" },
              { icon: "🌍", text: "Relatórios ESG e impacto ambiental" },
              { icon: "🤖", text: "Insights com inteligência artificial" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "1rem", width: "32px", height: "32px", background: "rgba(168,217,156,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: "0.875rem", color: "#6B9060" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: "relative", zIndex: 1, fontSize: "0.78rem", color: "#2D3D24" }}>
          © 2026 EcoValor • Todos os direitos reservados
        </p>
      </div>

      {/* Lado direito — formulário */}
      <div className="ev-auth-right" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1A2410", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              Entrar na conta
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#7A9870" }}>
              Não tem conta?{" "}
              <Link href="/register" style={{ color: "#2D6A1F", fontWeight: 600, textDecoration: "none" }}>
                Cadastrar-se
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

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "E-mail", type: "email", placeholder: "contato@empresa.com.br", value: email, set: setEmail, autoComplete: "email" },
              { label: "Senha", type: "password", placeholder: "••••••••", value: password, set: setPassword, autoComplete: "current-password" },
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
                  autoComplete={field.autoComplete}
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
              {loading ? "Autenticando..." : "Entrar →"}
            </button>
          </form>

          <p style={{ fontSize: "0.78rem", color: "#A8B8A0", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
            Ao entrar, você concorda com nossos{" "}
            <a href="#" style={{ color: "#2D6A1F", textDecoration: "none" }}>Termos de Uso</a>
            {" "}e{" "}
            <a href="#" style={{ color: "#2D6A1F", textDecoration: "none" }}>Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
}