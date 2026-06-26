import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  MapPin,
  ShoppingCart,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../supabaseClient";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number; 
  unit: string;
  price_per_unit: number; 
  total_value: number;    
  location: string;
  image_emoji: string;    
  seller: string;
  status: string;
  selectedQuantity?: number;
  isOwn?: boolean;
}

const categories = [
  "Todas",
  "Madeira",
  "Metal",
  "Alumínio",
  "Cobre",
  "Químico",
];


// Ícones SVG por categoria de resíduo
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, JSX.Element> = {
    "Madeira": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="8" y="32" width="56" height="10" rx="5" fill="#8B5E3C" opacity="0.8"/>
        <rect x="14" y="22" width="44" height="10" rx="5" fill="#A0724E" opacity="0.8"/>
        <rect x="20" y="42" width="32" height="10" rx="5" fill="#7A4F2D" opacity="0.8"/>
        <circle cx="36" cy="20" r="8" fill="#5C8A3C" opacity="0.6"/>
        <path d="M36 12 L36 20 M30 15 L36 20 M42 15 L36 20" stroke="#4A7A30" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    "Metal": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="16" y="28" width="40" height="6" rx="3" fill="#7A8FA6" opacity="0.9"/>
        <rect x="16" y="36" width="40" height="6" rx="3" fill="#637A91" opacity="0.9"/>
        <rect x="16" y="44" width="40" height="6" rx="3" fill="#4E6478" opacity="0.9"/>
        <rect x="26" y="20" width="20" height="8" rx="4" fill="#8FA3BA" opacity="0.7"/>
        <circle cx="36" cy="18" r="4" fill="#A8BDD0" opacity="0.8"/>
      </svg>
    ),
    "Alumínio": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <path d="M20 48 L36 20 L52 48 Z" fill="#B8C8D8" opacity="0.85"/>
        <path d="M24 44 L36 26 L48 44 Z" fill="#D0DDE8" opacity="0.7"/>
        <rect x="22" y="48" width="28" height="5" rx="2.5" fill="#A0B4C8" opacity="0.9"/>
        <circle cx="36" cy="36" r="5" fill="#C8D8E8" opacity="0.6"/>
      </svg>
    ),
    "Cobre": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="20" fill="#C87941" opacity="0.15"/>
        <path d="M20 36 Q28 28 36 36 Q44 44 52 36" stroke="#C87941" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M20 42 Q28 34 36 42 Q44 50 52 42" stroke="#A86030" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
        <circle cx="36" cy="36" r="5" fill="#E0923A" opacity="0.8"/>
      </svg>
    ),
    "Ferro Fundido": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="18" y="24" width="36" height="28" rx="4" fill="#4A4A5A" opacity="0.8"/>
        <rect x="22" y="28" width="28" height="20" rx="2" fill="#3A3A4A" opacity="0.6"/>
        <circle cx="36" cy="38" r="6" fill="#5A5A6A" opacity="0.9"/>
        <circle cx="36" cy="38" r="3" fill="#2A2A3A" opacity="0.8"/>
      </svg>
    ),
    "Tinta em Pó": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="28" cy="38" r="10" fill="#E85D8A" opacity="0.7"/>
        <circle cx="44" cy="32" r="8" fill="#5B9E3A" opacity="0.7"/>
        <circle cx="38" cy="46" r="7" fill="#F0A030" opacity="0.7"/>
        <circle cx="26" cy="28" r="5" fill="#6B7FD4" opacity="0.6"/>
      </svg>
    ),
    "Químico": (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <path d="M28 20 L28 38 L18 52 L54 52 L44 38 L44 20 Z" fill="#3A8C6E" opacity="0.15" stroke="#3A8C6E" strokeWidth="2"/>
        <rect x="26" y="16" width="20" height="6" rx="3" fill="#3A8C6E" opacity="0.5"/>
        <circle cx="30" cy="44" r="4" fill="#57C4A0" opacity="0.7"/>
        <circle cx="42" cy="44" r="3" fill="#57C4A0" opacity="0.5"/>
        <circle cx="36" cy="40" r="2.5" fill="#3A8C6E" opacity="0.8"/>
      </svg>
    ),
  };

  const icon = icons[category] || (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="18" y="26" width="36" height="28" rx="6" fill="#2D6A1F" opacity="0.2"/>
      <rect x="24" y="20" width="24" height="8" rx="4" fill="#2D6A1F" opacity="0.3"/>
      <path d="M18 38 L54 38" stroke="#2D6A1F" strokeWidth="1.5" opacity="0.4"/>
      <path d="M24 44 L48 44" stroke="#2D6A1F" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  );

  return (
    <div style={{ opacity: 0.85 }}>
      {icon}
    </div>
  );
}

export default function Marketplace() {
  // Puxando o 'user' de dentro do hook useAuth para deixar os dados dinâmicos
  const { isAuthenticated, user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceRange, setPriceRange] = useState("all");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectModes, setSelectModes] = useState<{ [key: number]: string }>({});
  const [quantitiesInput, setQuantitiesInput] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchAvailableResidues() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("residuos")
          .select("*")
          .eq("status", "Disponível")
          .order("id", { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedProducts: Product[] = data.map((item: any) => {
            const qty = parseFloat(item.quantidade) || 0;
            const price = parseFloat(item.preco_unidade) || 0;
            const isOwn = item.user_id === user?.id;
            const sellerLabel = isOwn ? "Você" : (item.empresa_nome || "Empresa Parceira");
            return {
              id: item.id,
              name: item.nome,
              category: item.categoria,
              quantity: qty,
              unit: item.unidade || "kg",
              price_per_unit: price,
              total_value: qty * price,
              location: item.localizacao || "Não informada",
              image_emoji: item.categoria,
              seller: sellerLabel,
              status: item.status,
              isOwn,
            };
          });

          setProducts(mappedProducts);

          const initialModes: { [key: number]: string } = {};
          const initialQtys: { [key: number]: number } = {};
          
          mappedProducts.forEach(p => {
            initialModes[p.id] = p.quantity.toString();
            initialQtys[p.id] = p.quantity;
          });
          
          setSelectModes(initialModes);
          setQuantitiesInput(initialQtys);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do marketplace:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableResidues();
  }, [isAuthenticated]);

  const renderQuantityOptions = (maxStock: number) => {
    const options = [
      { label: "Lote Completo", value: maxStock },
      { label: "Metade do Lote (50%)", value: Math.round(maxStock * 0.5) },
      { label: "Quarto do Lote (25%)", value: Math.round(maxStock * 0.25) },
    ];

    const uniqueOptions = options.filter(
      (opt, index, self) => self.findIndex((o) => o.value === opt.value) === index && opt.value > 0
    );

    return (
      <>
        {uniqueOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value.toString()}>
            {opt.value} {opt.value === maxStock ? "(Lote Total)" : `(${opt.label.split("(")[1]}`}
          </SelectItem>
        ))}
        <SelectItem value="custom" className="font-semibold text-emerald-700">
          ✨ Digitar valor personalizado...
        </SelectItem>
      </>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.price_per_unit <= 15) ||
      (priceRange === "medium" &&
        product.price_per_unit > 15 &&
        product.price_per_unit <= 30) ||
      (priceRange === "high" && product.price_per_unit > 30);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: Product) => {
    if (cart.some((item) => item.id === product.id)) return;
    
    const chosenQty = quantitiesInput[product.id] || 1;

    if (chosenQty <= 0) {
      alert("Por favor, selecione uma quantidade válida maior que 0.");
      return;
    }

    if (chosenQty > product.quantity) {
      alert(`Quantidade indisponível! O estoque máximo atual é de ${product.quantity} ${product.unit}.`);
      return;
    }

    const itemParaCarrinho = {
      ...product,
      selectedQuantity: chosenQty,
      total_value: chosenQty * product.price_per_unit
    };

    setCart([...cart, itemParaCarrinho]);
  };

  const handleSelectChange = (productId: number, value: string, maxStock: number) => {
    setSelectModes({ ...selectModes, [productId]: value });

    if (value !== "custom") {
      setQuantitiesInput({
        ...quantitiesInput,
        [productId]: parseInt(value)
      });
    } else {
      setQuantitiesInput({
        ...quantitiesInput,
        [productId]: 1
      });
    }
  };

  const handleCustomInputChange = (productId: number, value: number, maxStock: number) => {
    let checkedValue = value;
    if (value > maxStock) checkedValue = maxStock;
    if (value < 1) checkedValue = 1;

    setQuantitiesInput({
      ...quantitiesInput,
      [productId]: checkedValue
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.total_value || 0), 0);
  };

  const handleCheckout = () => {
    alert("Compra simulada com sucesso!");
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) return null;

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D6A1F" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2D6A1F", textTransform: "uppercase", letterSpacing: "0.08em" }}>Marketplace</span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#1A2410", margin: 0 }}>
              Resíduos Disponíveis
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#7A9870", margin: "4px 0 0" }}>
              Compre matéria-prima de outras empresas ou anuncie os seus resíduos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-700 text-emerald-700 hover:bg-emerald-50 gap-2 font-semibold relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Carrinho
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] flex flex-col justify-between">
                <div className="flex flex-col flex-1 overflow-y-auto">
                  <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                      <ShoppingCart className="text-emerald-700" /> Seu Carrinho
                    </SheetTitle>
                  </SheetHeader>
                  
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
                      <p className="text-muted-foreground font-medium">Seu carrinho está vazio.</p>
                      <p className="text-xs text-muted-foreground mt-1">Adicione resíduos do marketplace.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {cart.map((item) => (
                        <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="text-2xl bg-secondary p-2 rounded-xl">{item.image_emoji}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-foreground line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.seller}</p>
                            <p className="text-xs font-medium text-foreground mt-1">
                              {item.selectedQuantity} {item.unit} × R$ {item.price_per_unit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <span className="font-bold text-sm text-emerald-700">
                              R$ {item.total_value.toLocaleString("pt-BR")}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center text-base font-semibold">
                      <span className="text-muted-foreground">Valor Total do Pedido:</span>
                      <span className="text-xl font-black text-emerald-700">
                        R$ {calculateTotal().toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <SheetFooter>
                      <Button 
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 py-6 rounded-xl shadow-md transition-all"
                        onClick={handleCheckout}
                      >
                        <CheckCircle className="w-5 h-5" /> Finalizar Compra
                      </Button>
                    </SheetFooter>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por resíduo disponível..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Categoria
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat ? "bg-emerald-700 text-white hover:bg-emerald-800" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Faixa de Preço
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os preços</SelectItem>
                    <SelectItem value="low">Até R$ 15/unidade</SelectItem>
                    <SelectItem value="medium">R$ 15 - R$ 30/unidade</SelectItem>
                    <SelectItem value="high">Acima de R$ 30/unidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Buscando..." : `${filteredProducts.length} lotes encontrados`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid de produtos */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-emerald-700 animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Carregando estoque do Supabase...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isAlreadyInCart = cart.some((item) => item.id === product.id);
              const currentMode = selectModes[product.id] || product.quantity.toString();
              const currentFinalValue = quantitiesInput[product.id] || product.quantity;

              return (
                <div
                  key={product.id}
                  style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E4EFE0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(45,106,31,0.06)" }}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,31,0.12)")}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(45,106,31,0.06)")}
                >
                  <div style={{ background: "linear-gradient(135deg, #F0F7EC 0%, #E4EFE0 100%)", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <CategoryIcon category={product.image_emoji} />
                    {product.isOwn && (
                      <span style={{ position: "absolute", top: "10px", left: "10px", background: "#1A2410", color: "#A8D99C", fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: "99px", letterSpacing: "0.04em" }}>
                        Seu anúncio
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.seller}
                          </p>
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-700 px-2 py-1 rounded font-medium">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estoque Total</span>
                        <span className="font-semibold text-foreground">
                          {product.quantity} {product.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço/Unidade</span>
                        <span className="font-semibold text-foreground">
                          R$ {product.price_per_unit.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 border-t border-dashed pt-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Quantidade do Lote
                        </label>
                        <Select
                          disabled={isAlreadyInCart}
                          value={currentMode}
                          onValueChange={(val) => handleSelectChange(product.id, val, product.quantity)}
                        >
                          <SelectTrigger className="w-full bg-secondary/50 font-medium">
                            <SelectValue placeholder="Escolha o volume" />
                          </SelectTrigger>
                          <SelectContent>
                            {renderQuantityOptions(product.quantity)}
                          </SelectContent>
                        </Select>

                        {currentMode === "custom" && (
                          <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                            <label className="text-[11px] font-medium text-emerald-700 block mb-1">
                              Digite o valor exato ({product.unit}):
                            </label>
                            <Input
                              type="number"
                              min={1}
                              max={product.quantity}
                              disabled={isAlreadyInCart}
                              value={currentFinalValue}
                              onChange={(e) => handleCustomInputChange(product.id, parseInt(e.target.value) || 0, product.quantity)}
                              className="w-full border-emerald-600 focus-visible:ring-emerald-600 font-bold"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between text-sm border-t border-border pt-3">
                        <span className="text-muted-foreground">Subtotal Selecionado</span>
                        <span className="font-bold text-emerald-700 text-lg">
                          R$ {(currentFinalValue * product.price_per_unit).toLocaleString("pt-BR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{ flex: 1, padding: "10px", border: "1.5px solid #D6E4CE", borderRadius: "10px", background: "none", color: "#2D6A1F", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.background = "#F0F7EC")}
                        onMouseOut={e => (e.currentTarget.style.background = "none")}
                      >
                        Detalhes
                      </button>
                      <button
                        style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", background: isAlreadyInCart ? "#E4EFE0" : "#2D6A1F", color: isAlreadyInCart ? "#7A9870" : "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: isAlreadyInCart ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.2s" }}
                        onClick={() => handleAddToCart(product)}
                        disabled={isAlreadyInCart}
                        onMouseOver={e => { if (!isAlreadyInCart) e.currentTarget.style.background = "#245518"; }}
                        onMouseOut={e => { if (!isAlreadyInCart) e.currentTarget.style.background = "#2D6A1F"; }}
                      >
                        <ShoppingCart size={15} />
                        {isAlreadyInCart ? "No Carrinho" : "Comprar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estado Vazio */}
        {!isLoading && filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum resíduo à venda
            </h3>
            <p className="text-muted-foreground">
              Cadastre novos itens como "Disponível" na tela de Gestão de Resíduos para que eles apareçam aqui automaticamente.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}