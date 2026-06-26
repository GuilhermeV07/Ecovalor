import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CalendarIcon,
} from "lucide-react";
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

const categories = [
  "Madeira",
  "Metal",
  "Alumínio",
  "Cobre",
  "Ferro Fundido",
  "Tinta em Pó",
  "Outro",
];

const units = ["kg", "ton", "l", "m3", "unit"];

export default function ResidueManagement() {
  const { isAuthenticated, user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [residues, setResidues] = useState<Residue[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    location: "",
  });
  const [validade, setValidade] = useState<Date | undefined>(undefined);

  const fetchResidues = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("residuos")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) throw error;
      setResidues(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar resíduos:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchResidues();
    }
  }, [isAuthenticated, user]);

  if (loading) return null;

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleAddResidue = async () => {
    if (!user?.id) return;

    try {
      if (!formData.name || !formData.category || !formData.quantity || !formData.pricePerUnit || !formData.location) {
        alert("Por favor, preencha todos os campos do formulário antes de publicar.");
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from("residuos")
          .update({
            nome: formData.name,
            categoria: formData.category,
            quantidade: parseFloat(formData.quantity),
            unidade: formData.unit,
            preco_unidade: parseFloat(formData.pricePerUnit),
            localizacao: formData.location,
            validade: validade ? validade.toISOString().split("T")[0] : null,
          })
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("residuos")
          .insert([
            {
              nome: formData.name,
              categoria: formData.category,
              quantidade: parseFloat(formData.quantity),
              unidade: formData.unit,
              preco_unidade: parseFloat(formData.pricePerUnit),
              localizacao: formData.location,
              status: "Disponível",
              user_id: user.id,
              validade: validade ? validade.toISOString().split("T")[0] : null,
              empresa_nome: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Empresa Parceira",
            },
          ]);

        if (error) throw error;
      }

      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
        location: "",
      });
      setValidade(undefined);
      setIsDialogOpen(false);
      fetchResidues();
    } catch (error: any) {
      console.error("Erro ao salvar dados no Supabase:", error.message);
      alert("Erro ao salvar anúncio: " + error.message);
    }
  };

  const handleEdit = (residue: Residue) => {
    setFormData({
      name: residue.nome,
      category: residue.categoria,
      quantity: residue.quantidade.toString(),
      unit: residue.unidade,
      pricePerUnit: residue.preco_unidade.toString(),
      location: residue.localizacao,
    });
    setValidade(residue.validade ? new Date(residue.validade) : undefined);
    setEditingId(residue.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!user?.id) return;

    if (confirm("Tem certeza que deseja excluir este resíduo?")) {
      try {
        const { error } = await supabase
          .from("residuos")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;
        fetchResidues();
      } catch (error: any) {
        console.error("Erro ao deletar resíduo:", error.message);
      }
    }
  };

  const totalQuantity = residues.reduce((sum, r) => sum + r.quantidade, 0);
  const totalValue = residues.reduce((sum, r) => sum + r.quantidade * r.preco_unidade, 0);
  const totalCo2 = residues.reduce((sum, r) => sum + (r.quantidade * 0.15), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-[#f8f9f6] p-6 rounded-2xl min-h-screen">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#111111] tracking-tight">
              Gestão de Resíduos
            </h1>
            <p className="text-[#666666] text-sm mt-1 font-medium">
              Cadastre e gerencie seu inventário de resíduos industriais privado
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#155324] hover:bg-[#0e3a19] text-white gap-2 font-bold px-6 py-5 rounded-xl transition-all shadow-sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    category: "",
                    quantity: "",
                    unit: "kg",
                    pricePerUnit: "",
                    location: "",
                  });
                  setValidade(undefined);
                }}
              >
                <Plus className="w-5 h-5" />
                Anunciar Resíduo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white rounded-2xl border border-gray-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editingId ? "Editar Resíduo Industrial" : "Anunciar Resíduo Industrial"}
                </DialogTitle>
                <DialogDescription>
                  Insira as especificações do lote que deseja disponibilizar no mercado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Nome do Material
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Borra de Zinco Modificada"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 border-gray-200 focus-visible:ring-[#155324] rounded-lg"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Categoria
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1 border-gray-200 rounded-lg">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                      Quantidade
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="500"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="mt-1 border-gray-200 focus-visible:ring-[#155324] rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                      Unidade
                    </Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger className="mt-1 border-gray-200 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price per Unit */}
                <div>
                  <Label htmlFor="price" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Preço por Unidade (R$)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="12.50"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    className="mt-1 border-gray-200 focus-visible:ring-[#155324] rounded-lg"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Localização de Coleta
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ex: Campinas, SP"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 border-gray-200 focus-visible:ring-[#155324] rounded-lg"
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <Label className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Data de Validade do Anúncio
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 justify-start text-left font-normal border-gray-200 rounded-lg"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {validade ? format(validade, "dd/MM/yyyy", { locale: ptBR }) : <span className="text-muted-foreground">Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validade}
                        onSelect={setValidade}
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-700 rounded-lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-[#155324] hover:bg-[#0e3a19] text-white font-semibold rounded-lg"
                    onClick={handleAddResidue}
                  >
                    {editingId ? "Salvar Alterações" : "Publicar Anúncio"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total em Estoque */}
          <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Massa em Estoque</p>
                <p className="text-4xl font-extrabold text-[#111111] mt-2 tracking-tight">
                  {totalQuantity.toLocaleString("pt-BR")} <span className="text-2xl font-bold">kg</span>
                </p>
                <div className="inline-flex items-center gap-1 bg-[#edf7ee] text-[#2e7d32] text-xs font-bold px-2 py-1 rounded-md mt-4">
                  <span>↗ +12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-[#f1f8f3] rounded-xl text-[#155324]">
                <span className="text-xl">📦</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Valor Total */}
          <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor de Mercado</p>
                <p className="text-4xl font-extrabold text-[#111111] mt-2 tracking-tight">
                  <span className="text-2xl font-bold">R$ </span>{totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="inline-flex items-center gap-1 bg-[#edf7ee] text-[#2e7d32] text-xs font-bold px-2 py-1 rounded-md mt-4">
                  <span>↗ +8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-[#f1f8f3] rounded-xl text-[#155324]">
                <span className="text-xl">＄</span>
              </div>
            </div>
          </Card>

          {/* Card 3: CO2 Evitado */}
          <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CO₂ Retido</p>
                <p className="text-4xl font-extrabold text-[#111111] mt-2 tracking-tight">
                  {totalCo2.toFixed(1).toLocaleString("pt-BR")} <span className="text-2xl font-bold">kg</span>
                </p>
                <div className="inline-flex items-center gap-1 bg-[#edf7ee] text-[#2e7d32] text-xs font-bold px-2 py-1 rounded-md mt-4">
                  <span>↗ +18.7%</span>
                </div>
              </div>
              <div className="p-3 bg-[#f1f8f3] rounded-xl text-[#155324]">
                <span className="text-xl">🍃</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Residues Table */}
        <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider">Nome</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider">Categoria</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider text-right">Quantidade</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider text-right">Preço/Un</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider text-right">Valor Total</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider">Localização</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider">Status</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs tracking-wider text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-400 font-medium">
                      Nenhum resíduo anunciado ainda para esta conta. Clique em "Anunciar Resíduo" para começar.
                    </TableCell>
                  </TableRow>
                ) : (
                  residues.map((residue) => (
                    <TableRow key={residue.id} className="border-b border-gray-50 last:border-0 hover:bg-[#fcfdfe]/60 transition-colors">
                      <TableCell className="font-bold text-[#111111] py-4">
                        {residue.nome}
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {residue.categoria}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[#111111]">
                        {residue.quantidade} {residue.unidade}
                      </TableCell>
                      <TableCell className="text-right text-gray-500 font-medium">
                        R$ {residue.preco_unidade.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-[#155324]">
                        R$ {(residue.quantidade * residue.preco_unidade).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{residue.localizacao}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold inline-block tracking-wide ${
                            residue.status === "Disponível"
                              ? "bg-[#edf7ee] text-[#2e7d32]"
                              : residue.status === "Reservado"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {residue.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100 text-gray-500 rounded-lg h-8 w-8 p-0"
                            onClick={() => handleEdit(residue)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg h-8 w-8 p-0"
                            onClick={() => handleDelete(residue.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}