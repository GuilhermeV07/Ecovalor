import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F9F5", minHeight: "100vh", color: "#1A2410" }}>

      {/* NAV */}
      <nav className="ev-nav" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(247,249,245,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #D6E4CE", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#2D6A1F"/>
            <path d="M10 22 Q16 8 22 22" stroke="#A8D99C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M16 16 Q20 10 24 14" stroke="#F7F9F5" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="ev-nav-logo-text" style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "#1A2410" }}>EcoValor</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => navigate("/login")} className="ev-nav-btn-secondary" style={{
            background: "none", border: "none", cursor: "pointer",
            fontWeight: 500, fontSize: "0.95rem", color: "#3A5C2A", padding: "8px 16px",
            borderRadius: "8px", transition: "background 0.2s"
          }}
            onMouseOver={e => (e.currentTarget.style.background = "#E4EFE0")}
            onMouseOut={e => (e.currentTarget.style.background = "none")}
          >Entrar</button>
          <button onClick={() => navigate("/register")} style={{
            background: "#2D6A1F", color: "#fff", border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: "0.95rem", padding: "8px 20px",
            borderRadius: "10px", transition: "background 0.2s"
          }}
            onMouseOver={e => (e.currentTarget.style.background = "#245518")}
            onMouseOut={e => (e.currentTarget.style.background = "#2D6A1F")}
          >Cadastrar-se</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ev-hero" style={{ padding: "80px 2rem 60px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <div>
            <div className="ev-hero-badge" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#E4EFE0", borderRadius: "100px", padding: "6px 14px",
              fontSize: "0.8rem", fontWeight: 600, color: "#2D6A1F", marginBottom: "24px",
              letterSpacing: "0.04em", textTransform: "uppercase"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D6A1F", display: "inline-block" }}></span>
              Economia Circular Industrial
            </div>
            <h1 className="ev-hero-title" style={{
              fontSize: "clamp(3.2rem, 7vw, 5.5rem)", fontWeight: 800,
              lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "24px", color: "#1A2410"
            }}>
              Resíduo de um.<br />
              <span style={{ color: "#2D6A1F" }}>Matéria-prima</span><br />
              de outro.
            </h1>
            <p className="ev-hero-desc" style={{ fontSize: "1.25rem", color: "#4A6040", lineHeight: 1.7, marginBottom: "40px", maxWidth: "580px" }}>
              A EcoValor conecta indústrias que geram resíduos com empresas que precisam de matéria-prima — reduzindo custos e emissões ao mesmo tempo.
            </p>
            <div className="ev-hero-buttons" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => navigate("/register")} style={{
                background: "#2D6A1F", color: "#fff", border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: "1rem", padding: "14px 28px",
                borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px",
                transition: "transform 0.15s, background 0.2s"
              }}
                onMouseOver={e => (e.currentTarget.style.background = "#245518")}
                onMouseOut={e => (e.currentTarget.style.background = "#2D6A1F")}
              >
                Acessar Marketplace
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => navigate("/login")} style={{
                background: "none", color: "#2D6A1F", border: "2px solid #C5DFB8", cursor: "pointer",
                fontWeight: 600, fontSize: "1rem", padding: "12px 24px",
                borderRadius: "12px", transition: "border-color 0.2s"
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                onMouseOut={e => (e.currentTarget.style.borderColor = "#C5DFB8")}
              >Saiba Mais</button>
            </div>
            <p style={{ marginTop: "24px", fontSize: "0.85rem", color: "#7A9870" }}>
              Junte-se a <strong style={{ color: "#2D6A1F" }}>450+</strong> empresas já na plataforma
            </p>
          </div>


        </div>
      </section>

      {/* MÉTRICAS */}
      <section style={{ background: "#1A2410", padding: "60px 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="ev-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {[
              { n: "2.5M", unit: "kg", label: "Resíduos processados" },
              { n: "1.2K", unit: "ton", label: "CO₂ evitado" },
              { n: "R$8.5M", unit: "", label: "Economia gerada" },
              { n: "450+", unit: "", label: "Empresas parceiras" },
            ].map((m, i) => (
              <div key={i} style={{
                padding: "36px 28px", borderRight: i < 3 ? "1px solid #2D3D24" : "none",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "#A8D99C", letterSpacing: "-0.03em" }}>{m.n}</span>
                  {m.unit && <span style={{ fontSize: "1rem", color: "#6B9060", fontWeight: 600 }}>{m.unit}</span>}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#6B9060", marginTop: "6px" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="ev-section" style={{ padding: "100px 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Como funciona</div>
          <h2 className="ev-section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1A2410", maxWidth: "500px", lineHeight: 1.15 }}>
            Do resíduo à<br />matéria-prima em 4 etapas
          </h2>
        </div>
        <div className="ev-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[
            { step: "01", emoji: "♻️", title: "Cadastre", desc: "Anuncie seus resíduos industriais com categoria, quantidade e preço" },
            { step: "02", emoji: "🤖", title: "A IA analisa", desc: "Nossa IA sugere o melhor preço e encontra compradores compatíveis" },
            { step: "03", emoji: "🤝", title: "Negocie", desc: "Conecte-se diretamente com compradores interessados no seu material" },
            { step: "04", emoji: "🌱", title: "Impacte", desc: "Gere receita, reduza custos de descarte e diminua emissões de CO₂" },
          ].map((s) => (
            <div key={s.step} style={{
              background: "#fff", borderRadius: "16px", padding: "28px",
              border: "1px solid #E4EFE0", transition: "box-shadow 0.2s",
              position: "relative", overflow: "hidden"
            }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,31,0.12)")}
              onMouseOut={e => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ position: "absolute", top: "16px", right: "16px", fontSize: "0.75rem", fontWeight: 800, color: "#D6E4CE", letterSpacing: "0.02em" }}>{s.step}</div>
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{s.emoji}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1A2410", marginBottom: "8px" }}>{s.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#4A6040", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="ev-section" style={{ background: "#F0F7EC", padding: "100px 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Plataforma completa</div>
            <h2 className="ev-section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1A2410", lineHeight: 1.15 }}>
              Tudo num só lugar
            </h2>
          </div>
          <div className="ev-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { icon: "📊", title: "Marketplace Inteligente", desc: "Compre e venda resíduos com preços sugeridos por IA e matching automático de compradores.", tag: "Popular" },
              { icon: "📦", title: "Gestão de Estoque", desc: "Controle seu inventário de resíduos com rastreamento em tempo real e histórico completo.", tag: null },
              { icon: "🌍", title: "Painel ESG", desc: "Monitore métricas ambientais, CO₂ evitado e conformidade com regulamentações ESG.", tag: "Novo" },
              { icon: "💰", title: "Área Financeira", desc: "Acompanhe receitas, custos e lucros das suas transações de resíduos em um só painel.", tag: null },
              { icon: "🤖", title: "IA & Insights", desc: "Recomendações inteligentes de preço, demanda de mercado e oportunidades de venda.", tag: null },
              { icon: "🔒", title: "Segurança Total", desc: "Autenticação robusta, dados criptografados e acesso individualizado por empresa.", tag: null },
            ].map((f) => (
              <div key={f.title} style={{
                background: "#fff", borderRadius: "16px", padding: "28px",
                border: "1px solid #E4EFE0", transition: "box-shadow 0.2s", position: "relative"
              }}
                onMouseOver={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,31,0.10)")}
                onMouseOut={e => (e.currentTarget.style.boxShadow = "none")}
              >
                {f.tag && (
                  <span style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: f.tag === "Popular" ? "#2D6A1F" : "#5B9E3A",
                    color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                    padding: "3px 8px", borderRadius: "99px", letterSpacing: "0.04em"
                  }}>{f.tag}</span>
                )}
                <div style={{ fontSize: "1.8rem", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A2410", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#4A6040", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECONOMIA CIRCULAR */}
      <section className="ev-section" style={{ padding: "100px 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="ev-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Nosso impacto</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1A2410", marginBottom: "24px", lineHeight: 1.15 }}>
              Economia circular<br />em ação
            </h2>
            <p style={{ color: "#4A6040", lineHeight: 1.75, marginBottom: "16px" }}>
              A economia circular elimina o conceito de resíduo. A EcoValor conecta geradores de resíduos com empresas que podem reutilizá-los como matéria-prima.
            </p>
            <p style={{ color: "#4A6040", lineHeight: 1.75, marginBottom: "32px" }}>
              Isso reduz custos com descarte, gera receita adicional e contribui significativamente para a redução de emissões de carbono.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Redução de custos com descarte", "Geração de receita adicional", "Impacto ambiental positivo mensurável", "Conformidade com regulamentações ESG"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#E4EFE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#2D6A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: "0.9rem", color: "#1A2410", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {[
              { emoji: "♻️", title: "Coleta", desc: "Resíduos industriais são catalogados na plataforma" },
              { emoji: "🤖", title: "Análise com IA", desc: "Avaliação automática de qualidade e sugestão de preço" },
              { emoji: "🤝", title: "Comercialização", desc: "Conexão direta com compradores compatíveis" },
              { emoji: "🌱", title: "Impacto", desc: "Redução de resíduos, emissões e custos operacionais" },
            ].map((step, i) => (
              <div key={step.title} style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "20px 24px", background: i % 2 === 0 ? "#fff" : "#F7F9F5", borderRadius: "12px", border: "1px solid #E4EFE0" }}>
                <div style={{ fontSize: "1.6rem", flexShrink: 0 }}>{step.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#1A2410", marginBottom: "4px" }}>{step.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#4A6040" }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ev-cta" style={{ background: "#1A2410", padding: "100px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🌿</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "16px", lineHeight: 1.15 }}>
            Comece a transformar seus resíduos hoje
          </h2>
          <p style={{ color: "#6B9060", fontSize: "1.1rem", marginBottom: "36px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente e faça parte da maior plataforma de economia circular industrial do Brasil.
          </p>
          <button onClick={() => navigate("/register")} style={{
            background: "#A8D99C", color: "#1A2410", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "1.05rem", padding: "16px 36px",
            borderRadius: "12px", transition: "background 0.2s"
          }}
            onMouseOver={e => (e.currentTarget.style.background = "#8FCC82")}
            onMouseOut={e => (e.currentTarget.style.background = "#A8D99C")}
          >
            Criar conta gratuita →
          </button>
          <p style={{ color: "#3A5C2A", fontSize: "0.85rem", marginTop: "16px" }}>Sem cartão de crédito • Sem compromisso</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111A0C", padding: "60px 2rem 32px", borderTop: "1px solid #2D3D24" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="ev-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#2D6A1F"/>
                  <path d="M10 22 Q16 8 22 22" stroke="#A8D99C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
                <span style={{ fontWeight: 700, color: "#fff" }}>EcoValor</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#4A6040", lineHeight: 1.7, maxWidth: "260px" }}>
                Transformando resíduos industriais em oportunidades de negócio e impacto ambiental positivo.
              </p>
            </div>
            {[
              { title: "Produto", links: ["Marketplace", "Dashboard", "ESG", "Financeiro"] },
              { title: "Empresa", links: ["Sobre", "Blog", "Contato", "Parceiros"] },
              { title: "Legal", links: ["Privacidade", "Termos", "Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight: 700, color: "#6B9060", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ color: "#4A6040", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#A8D99C")}
                        onMouseOut={e => (e.currentTarget.style.color = "#4A6040")}
                      >{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ev-footer-bottom" style={{ borderTop: "1px solid #2D3D24", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.8rem", color: "#3A5C2A" }}>© 2026 EcoValor. Todos os direitos reservados.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {["LinkedIn", "Instagram", "Twitter"].map(s => (
                <a key={s} href="#" style={{ fontSize: "0.8rem", color: "#3A5C2A", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#A8D99C")}
                  onMouseOut={e => (e.currentTarget.style.color = "#3A5C2A")}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}