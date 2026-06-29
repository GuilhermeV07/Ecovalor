import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Leaf, Droplet, Package, DollarSign, ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";

const COLORS = ["#2D6A1F", "#3A8C6E", "#5B9E3A", "#A8D99C", "#6366f1", "#f59e0b"];
const MONTHS_BR = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const s = {
  card: {
    background: "#fff", borderRadius: "16px", border: "1px solid #E4EFE0",
    padding: "24px", boxShadow: "0 1px 4px rgba(45,106,31,0.06)"
  } as React.CSSProperties,
  label: { fontSize: "0.78rem", fontWeight: 600, color: "#7A9870", textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  value: { fontSize: "1.9rem", fontWeight: 800, color: "#1A2410", letterSpacing: "-0.03em", margin: "6px 0 4px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", fontWeight: 600, color: "#2D6A1F", background: "#E4EFE0", borderRadius: "99px", padding: "3px 10px" },
  section: { fontSize: "1rem", fontWeight: 700, color: "#1A2410", marginBottom: "4px" },
  sub: { fontSize: "0.8rem", color: "#7A9870", marginBottom: "20px" },
};

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const [totalEstoque, setTotalEstoque] = useState(0);
  const [totalValor, setTotalValor] = useState(0);
  const [totalCo2, setTotalCo2] = useState(0);
  const [totalAgua, setTotalAgua] = useState(0);
  const [categoryPieData, setCategoryPieData] = useState<any[]>([]);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [monthlyCo2Data, setMonthlyCo2Data] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.from("residuos").select("*").eq("user_id", user.id);
      if (error) throw error;
      if (data && data.length > 0) {
        const estoque = data.reduce((s, i) => s + (Number(i.quantidade) || 0), 0);
        const valor = data.reduce((s, i) => s + ((Number(i.quantidade) || 0) * (Number(i.preco_unidade) || 0)), 0);
        setTotalEstoque(estoque); setTotalValor(valor);
        setTotalCo2(estoque * 0.15); setTotalAgua(estoque * 4.2);

        const monthlyMap: { [k: string]: { vendidos: number; disponiveis: number; receita: number; co2: number } } = {};
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          monthlyMap[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`] = { vendidos:0, disponiveis:0, receita:0, co2:0 };
        }
        data.forEach(item => {
          if (!item.created_at) return;
          const d = new Date(item.created_at);
          const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          if (monthlyMap[k]) {
            const q = Number(item.quantidade)||0;
            const preco = Number(item.preco_unidade)||0;
            if (item.status === "Vendido") {
              monthlyMap[k].vendidos += q;
              monthlyMap[k].receita += q * preco;
            } else {
              monthlyMap[k].disponiveis += q;
            }
            monthlyMap[k].co2 += q * 0.15;
          }
        });
        const eco: any[] = [], co2arr: any[] = [];
        Object.keys(monthlyMap).sort().forEach(k => {
          const [,m] = k.split("-");
          const lbl = MONTHS_BR[parseInt(m)-1];
          eco.push({ month: lbl, vendidos: Math.round(monthlyMap[k].vendidos), disponiveis: Math.round(monthlyMap[k].disponiveis), receita: Math.round(monthlyMap[k].receita) });
          co2arr.push({ month: lbl, co2: Math.round(monthlyMap[k].co2) });
        });
        setMonthlySalesData(eco); setMonthlyCo2Data(co2arr);

        const catMap: {[k:string]:number} = {};
        data.forEach(i => { const c=i.categoria||"Outros"; catMap[c]=(catMap[c]||0)+(Number(i.quantidade)||0); });
        const total = Object.values(catMap).reduce((a,b)=>a+b,0);
        setCategoryPieData(Object.keys(catMap).map((k,i) => ({ name:k, value: total>0?Math.round((catMap[k]/total)*100):0, color:COLORS[i%COLORS.length] })));
      } else {
        setCategoryPieData([]); setMonthlyEcoData([]); setMonthlyCo2Data([]);
        setTotalEstoque(0); setTotalValor(0); setTotalCo2(0); setTotalAgua(0);
      }
    } catch(e:any) { console.error(e.message); }
  };

  useEffect(() => { if (isAuthenticated && user) fetchDashboardData(); }, [isAuthenticated, user]);

  if (loading) return null;
  if (!isAuthenticated) { navigate("/"); return null; }

  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split("@")[0] : "Usuário");

  const kpis = [
    { title: "Massa em Estoque", value: `${totalEstoque.toLocaleString("pt-BR")} kg`, change: "+12.5%", icon: Package, accent: "#2D6A1F", bg: "#E4EFE0" },
    { title: "Valor de Mercado", value: `R$ ${totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, change: "+8.2%", icon: DollarSign, accent: "#3A8C6E", bg: "#E0F0EC" },
    { title: "Água Poupada", value: `${Math.round(totalAgua).toLocaleString("pt-BR")} L`, change: "+14.1%", icon: Droplet, accent: "#1E6B9B", bg: "#DCEEF8" },
    { title: "CO₂ Retido", value: `${totalCo2.toFixed(1)} kg`, change: "+18.7%", icon: Leaf, accent: "#5B9E3A", bg: "#EAF5E0" },
  ];

  const tooltipStyle = { backgroundColor: "#1A2410", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.82rem" };

  return (
    <DashboardLayout>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1A2410", padding: "8px 4px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D6A1F" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em" }}>Painel pessoal</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            Bem-vindo, <span style={{ color: "#2D6A1F" }}>{userDisplayName}</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#7A9870", margin: 0 }}>
            Painel de Desempenho ESG e Monitoramento de Impacto Ambiental
          </p>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {kpis.map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={s.label}>{kpi.title}</div>
                    <div style={s.value}>{kpi.value}</div>
                    <div style={s.badge}>
                      <ArrowUpRight size={11} />
                      {kpi.change}
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "12px", background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={kpi.accent} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "16px" }}>

          {/* Bar chart */}
          <div style={s.card}>
            <div style={s.section}>Vendas de Resíduos por Mês</div>
            <div style={s.sub}>Quantidade vendida vs. disponível em estoque (kg)</div>
            {monthlySalesData.length === 0 ? (
              <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#A8B8A0", fontSize: "0.875rem" }}>
                Sem dados ainda. Cadastre resíduos para ver o gráfico.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlySalesData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EC" vertical={false} />
                  <XAxis dataKey="month" stroke="#7bb45f" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A8B8A0" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F0F7EC" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem", paddingTop: "12px" }} />
                  <Bar dataKey="vendidos" name="Vendidos (kg)" fill="#58864e" radius={[6,6,0,0]} />
                  <Bar dataKey="disponiveis" name="Disponíveis (kg)" fill="#50c430" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart */}
          <div style={s.card}>
            <div style={s.section}>Distribuição por Categoria</div>
            <div style={s.sub}>Massa alocada por tipo de resíduo</div>
            {categoryPieData.length === 0 ? (
              <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#A8B8A0", fontSize: "0.875rem", textAlign: "center" }}>
                Nenhum resíduo catalogado.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {categoryPieData.map(cat => (
                    <div key={cat.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.8rem", color: "#4A6040" }}>{cat.name}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1A2410" }}>{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Line chart */}
        <div style={s.card}>
          <div style={s.section}>Prevenção de Emissões Atmosféricas — CO₂</div>
          <div style={s.sub}>Pegada de carbono mitigada mensalmente (kg de CO₂ equivalente)</div>
          {monthlyCo2Data.length === 0 ? (
            <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#A8B8A0", fontSize: "0.875rem" }}>
              Sem dados históricos de carbono para a sua conta.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyCo2Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F7EC" vertical={false} />
                <XAxis dataKey="month" stroke="#7bbe5a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6eb64a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem", paddingTop: "12px" }} />
                <Line type="monotone" dataKey="co2" name="CO₂ Mitigado (kg)" stroke="#2D6A1F" strokeWidth={2.5}
                  dot={{ fill: "#2D6A1F", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#2D6A1F" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}