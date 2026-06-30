import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabaseClient";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Package, MapPin, TrendingUp, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface Residue {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  preco_unidade: number;
  localizacao: string;
  status: "Disponível" | "Reservado" | "Vendido";
  co2_evitado?: number;
  validade?: string;
  user_id?: string;
}

const categories = ["Madeira","Metal","Alumínio","Cobre","Ferro Fundido","Tinta em Pó","Outro"];
const units = ["kg","ton","l","m3","unit"];

const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", boxSizing: "border-box",
  border: "1.5px solid #D6E4CE", borderRadius: "10px",
  padding: "10px 14px", fontSize: "0.875rem", color: "#1A2410",
  background: "#fff", outline: "none", fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 700,
  color: "#1A2410", marginBottom: "6px", letterSpacing: "0.01em",
  textTransform: "uppercase",
};

export default function ResidueManagement() {
  const { isAuthenticated, user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [residues, setResidues] = useState<Residue[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name:"", category:"", quantity:"", unit:"kg", pricePerUnit:"", location:"" });
  const [validade, setValidade] = useState<Date | undefined>(undefined);

  const fetchResidues = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.from("residuos").select("*").eq("user_id", user.id).order("id", { ascending: false });
      if (error) throw error;
      setResidues(data || []);
    } catch (e: any) { console.error(e.message); }
  };

  useEffect(() => { if (isAuthenticated && user) fetchResidues(); }, [isAuthenticated, user]);

  if (loading) return null;
  if (!isAuthenticated) { navigate("/"); return null; }

  const handleAddResidue = async () => {
    if (!user?.id) return;
    try {
      if (!formData.name || !formData.category || !formData.quantity || !formData.pricePerUnit || !formData.location) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
      if (editingId) {
        const { error } = await supabase.from("residuos").update({
          nome: formData.name, categoria: formData.category,
          quantidade: parseFloat(formData.quantity), unidade: formData.unit,
          preco_unidade: parseFloat(formData.pricePerUnit), localizacao: formData.location,
          validade: validade ? validade.toISOString().split("T")[0] : null,
        }).eq("id", editingId).eq("user_id", user.id);
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("residuos").insert([{
          nome: formData.name, categoria: formData.category,
          quantidade: parseFloat(formData.quantity), unidade: formData.unit,
          preco_unidade: parseFloat(formData.pricePerUnit), localizacao: formData.location,
          status: "Disponível", user_id: user.id,
          validade: validade ? validade.toISOString().split("T")[0] : null,
          empresa_nome: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Empresa Parceira",
        }]);
        if (error) throw error;
      }
      setFormData({ name:"", category:"", quantity:"", unit:"kg", pricePerUnit:"", location:"" });
      setValidade(undefined);
      setIsDialogOpen(false);
      fetchResidues();
    } catch (e: any) { alert("Erro ao salvar: " + e.message); }
  };

  const handleEdit = (r: Residue) => {
    setFormData({ name:r.nome, category:r.categoria, quantity:r.quantidade.toString(), unit:r.unidade, pricePerUnit:r.preco_unidade.toString(), location:r.localizacao });
    setValidade(r.validade ? new Date(r.validade) : undefined);
    setEditingId(r.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!user?.id) return;
    if (confirm("Tem certeza que deseja excluir este resíduo?")) {
      try {
        const { error } = await supabase.from("residuos").delete().eq("id", id).eq("user_id", user.id);
        if (error) throw error;
        fetchResidues();
      } catch (e: any) { console.error(e.message); }
    }
  };

  const totalEstoque = residues.reduce((s, r) => s + r.quantidade, 0);
  const totalValue = residues.reduce((s, r) => s + r.quantidade * r.preco_unidade, 0);
  const totalCo2 = residues.reduce((s, r) => s + r.quantidade * 0.15, 0);

  const kpis = [
    { label: "Total em Estoque", value: `${totalEstoque.toLocaleString("pt-BR")} kg`, icon: Package, color: "#2D6A1F", bg: "#E4EFE0" },
    { label: "Valor Total", value: `R$ ${totalValue.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "#3A8C6E", bg: "#E0F0EC" },
    { label: "CO₂ Evitado", value: `${totalCo2.toFixed(1)} kg`, icon: null, emoji: "♻️", color: "#5B9E3A", bg: "#EAF5E0" },
  ];

  return (
    <DashboardLayout>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1A2410" }}>

        {/* Header */}
        <div className="ev-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D6A1F" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em" }}>Inventário privado</span>
            </div>
            <h1 className="ev-page-title" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 4px" }}>Gestão de Resíduos</h1>
            <p style={{ fontSize: "0.875rem", color: "#7A9870", margin: 0 }}>Cadastre e gerencie seu inventário de resíduos industriais</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => { setEditingId(null); setFormData({ name:"", category:"", quantity:"", unit:"kg", pricePerUnit:"", location:"" }); setValidade(undefined); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "#2D6A1F", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 20px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "background 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.background = "#245518")}
                onMouseOut={e => (e.currentTarget.style.background = "#2D6A1F")}
              >
                <Plus size={16} /> Anunciar Resíduo
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md" style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E4EFE0" }}>
              <DialogHeader>
                <DialogTitle style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1A2410" }}>
                  {editingId ? "Editar Resíduo" : "Anunciar Resíduo Industrial"}
                </DialogTitle>
                <DialogDescription style={{ color: "#7A9870", fontSize: "0.85rem" }}>
                  Insira as especificações do lote que deseja disponibilizar no mercado.
                </DialogDescription>
              </DialogHeader>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
                <div>
                  <label style={labelStyle}>Nome do Material</label>
                  <input style={inputStyle} placeholder="Ex: Borra de Zinco Modificada" value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    onFocus={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#D6E4CE")} />
                </div>

                <div>
                  <label style={labelStyle}>Categoria</label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger style={{ border: "1.5px solid #D6E4CE", borderRadius: "10px" }}>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Quantidade</label>
                    <input style={inputStyle} type="number" placeholder="500" value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      onFocus={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#D6E4CE")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Unidade</label>
                    <Select value={formData.unit} onValueChange={v => setFormData({...formData, unit: v})}>
                      <SelectTrigger style={{ border: "1.5px solid #D6E4CE", borderRadius: "10px" }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Preço por Unidade (R$)</label>
                  <input style={inputStyle} type="number" step="0.01" placeholder="12.50" value={formData.pricePerUnit}
                    onChange={e => setFormData({...formData, pricePerUnit: e.target.value})}
                    onFocus={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#D6E4CE")} />
                </div>

                <div>
                  <label style={labelStyle}>Localização de Coleta</label>
                  <input style={inputStyle} placeholder="Ex: Campinas, SP" value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    onFocus={e => (e.currentTarget.style.borderColor = "#2D6A1F")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#D6E4CE")} />
                </div>

                <div>
                  <label style={labelStyle}>Data de Validade do Anúncio</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button style={{ ...inputStyle, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: validade ? "#1A2410" : "#A8B8A0" }}>
                        <CalendarIcon size={15} color="#7A9870" />
                        {validade ? format(validade, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={validade} onSelect={setValidade} locale={ptBR} disabled={d => d < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
                  <button onClick={() => setIsDialogOpen(false)} style={{ flex: 1, padding: "11px", border: "1.5px solid #D6E4CE", borderRadius: "10px", background: "none", color: "#4A6040", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button onClick={handleAddResidue} style={{ flex: 1, padding: "11px", border: "none", borderRadius: "10px", background: "#2D6A1F", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#245518")}
                    onMouseOut={e => (e.currentTarget.style.background = "#2D6A1F")}
                  >
                    {editingId ? "Salvar Alterações" : "Publicar Anúncio"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="ev-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E4EFE0", padding: "24px", boxShadow: "0 1px 4px rgba(45,106,31,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7A9870", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{k.label}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1A2410", letterSpacing: "-0.03em" }}>{k.value}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {k.icon ? <k.icon size={20} color={k.color} /> : <span style={{ fontSize: "1.2rem" }}>{k.emoji}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E4EFE0", overflow: "hidden", boxShadow: "0 1px 4px rgba(45,106,31,0.06)" }}>
          <div className="ev-table-wrap" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#F7F9F5", borderBottom: "1px solid #E4EFE0" }}>
                  {["Nome","Categoria","Quantidade","Preço/Un","Valor Total","Localização","Status","Ações"].map((h, i) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: i >= 2 && i <= 4 ? "right" : i === 7 ? "center" : "left", fontSize: "0.72rem", fontWeight: 700, color: "#7A9870", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {residues.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#A8B8A0", fontSize: "0.875rem" }}>
                      Nenhum resíduo cadastrado. Clique em "Anunciar Resíduo" para começar.
                    </td>
                  </tr>
                ) : residues.map((r, idx) => (
                  <tr key={r.id} style={{ borderBottom: idx < residues.length - 1 ? "1px solid #F0F7EC" : "none", transition: "background 0.15s" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#FAFCF8")}
                    onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1A2410" }}>{r.nome}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "0.75rem", background: "#E4EFE0", color: "#2D6A1F", padding: "3px 10px", borderRadius: "99px", fontWeight: 700 }}>{r.categoria}</span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#1A2410", fontWeight: 500 }}>{r.quantidade} {r.unidade}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#4A6040" }}>R$ {r.preco_unidade.toFixed(2)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: "#2D6A1F" }}>
                      R$ {(r.quantidade * r.preco_unidade).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#7A9870" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={13} color="#A8B8A0" />
                        {r.localizacao}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: "0.72rem", padding: "4px 10px", borderRadius: "99px", fontWeight: 700,
                        background: r.status === "Disponível" ? "#E4EFE0" : r.status === "Reservado" ? "#FEF9E0" : "#F0F0F0",
                        color: r.status === "Disponível" ? "#2D6A1F" : r.status === "Reservado" ? "#A07820" : "#606060",
                      }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                        <button onClick={() => handleEdit(r)} style={{ width: 32, height: 32, border: "none", background: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A9870", transition: "background 0.15s" }}
                          onMouseOver={e => (e.currentTarget.style.background = "#E4EFE0")}
                          onMouseOut={e => (e.currentTarget.style.background = "none")}
                        ><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(r.id)} style={{ width: 32, height: 32, border: "none", background: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#E05A5A", transition: "background 0.15s" }}
                          onMouseOver={e => (e.currentTarget.style.background = "#FEE8E8")}
                          onMouseOut={e => (e.currentTarget.style.background = "none")}
                        ><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}