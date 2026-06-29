import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Importante: garantindo que o Input está importado
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";

export default function AIInsights() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  // 1. Novo estado para a barra de pesquisa/chat
  const [userQuery, setUserQuery] = useState("");
  
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [residues, setResidues] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchResidues = async () => {
      const { data, error } = await supabase
        .from("residuos")
        .select("id, nome, categoria, quantidade, preco_unidade")
        .eq("status", "Disponível")
        .order("id", { ascending: false });
      if (!error && data) setResidues(data);
    };
    fetchResidues();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  // 2. Lógica adaptada para ler o que o usuário digitou
  const handleAnalyzePrice = async () => {
    if (!userQuery.trim()) return;

    setLoading(true);

    // Como estamos no modo offline/simulador, vamos gerar um resultado genérico baseado no texto digitado
    setTimeout(() => {
      // Tenta encontrar um resíduo no banco que combine com o que o usuário digitou, 
      // ou usa valores genéricos se ele perguntar de algo que não existe.
      const residuoEncontrado = residues.find(r => 
        userQuery.toLowerCase().includes(r.nome.toLowerCase())
      );

      const precoBase = residuoEncontrado ? residuoEncontrado.preco_unidade : (Math.random() * 50 + 10);
      const precoSugeridoCalculado = +(precoBase * 1.2).toFixed(2);
      const nomeMaterial = residuoEncontrado ? residuoEncontrado.nome : "Material Pesquisado";
      
      setPriceAnalysis({
        currentPrice: precoBase,
        suggestedPrice: precoSugeridoCalculado,
        confidence: 0.92,
        reasoning: `Análise para "${userQuery}": Identificamos uma tendência de alta para ${nomeMaterial} devido à forte demanda no mercado de reciclagem neste trimestre.`,
        estimatedRevenue: +(100 * precoSugeridoCalculado).toFixed(2),
        estimatedProfit: +(100 * precoSugeridoCalculado * 0.45).toFixed(2),
        co2Impact: 150,
        potentialBuyers: [
          { name: "EcoDestino Soluções Ambientais", interest: "Alta", location: "São Paulo - SP" },
          { name: "Recicla Brasil Indústria", interest: "Média", location: "Minas Gerais" },
          { name: "Sustentare S/A", interest: "Alta", location: "Rio de Janeiro" }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  const aiRecommendations = [
    {
      title: "Aumentar Preço do Alumínio",
      description: "Demanda está 45% acima da oferta. Recomendação: aumentar preço em 12%",
      impact: "Potencial aumento de R$ 2,100 em receita",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Focar em Cobre",
      description: "Mercado de cobre está em alta. Oportunidade de expandir oferta",
      impact: "Potencial de R$ 15,000 em novas vendas",
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Otimizar Estoque de Madeira",
      description: "Velocidade de venda está lenta. Considere reduzir preço em 8%",
      impact: "Potencial aumento de 35% em volume de vendas",
      icon: Zap,
      color: "text-yellow-500",
    },
  ];

  const buyerMatches = [
    {
      company: "ABC Indústria",
      interests: ["Madeira", "Metal"],
      lastPurchase: "2026-06-15",
      totalSpent: "R$ 45,000",
      match: "95%",
    },
    {
      company: "XYZ Ltda",
      interests: ["Alumínio", "Cobre"],
      lastPurchase: "2026-06-10",
      totalSpent: "R$ 32,500",
      match: "88%",
    },
    {
      company: "Tech Industries",
      interests: ["Cobre", "Metal"],
      lastPurchase: "2026-06-20",
      totalSpent: "R$ 67,200",
      match: "92%",
    },
  ];

  // Permite enviar a mensagem apertando "Enter" no teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzePrice();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              IA & Insights
            </h1>
          </div>
          <p className="text-muted-foreground">
            Converse com a inteligência artificial sobre o mercado de resíduos
          </p>
        </div>

        {/* 3. Nova Interface: Barra de Pesquisa / Chat */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Pergunte à IA
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Descreva o que você deseja analisar. Ex: "Como está o preço do papelão hoje?"
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Digite sua dúvida ou material para análise..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 whitespace-nowrap"
                onClick={handleAnalyzePrice}
                disabled={!userQuery.trim() || loading}
              >
                {loading ? (
                  <Sparkles className="w-4 h-4 animate-pulse" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Analisando..." : "Pesquisar com IA"}
              </Button>
            </div>
          </div>

          {/* Resultados da Análise (Mantido igual, mas agora reage ao chat) */}
          {priceAnalysis && (
            <div className="mt-8 space-y-6 border-t border-border pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Preço Base (Estimado)</p>
                  <p className="text-3xl font-bold text-foreground">
                    R$ {priceAnalysis.currentPrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                    Preço Sugerido (IA)
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    R$ {priceAnalysis.suggestedPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +{((priceAnalysis.suggestedPrice / priceAnalysis.currentPrice - 1) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      Confiança da Análise
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {(priceAnalysis.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${priceAnalysis.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Resposta da Inteligência Artificial
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    {priceAnalysis.reasoning}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Receita Estimada</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {priceAnalysis.estimatedRevenue.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">Lucro Estimado</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {priceAnalysis.estimatedProfit.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">CO₂ Evitado</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {priceAnalysis.co2Impact} kg
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Compradores Interessados
                </h3>
                <div className="space-y-2">
                  {priceAnalysis.potentialBuyers.map((buyer: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition"
                    >
                      <div>
                        <p className="font-medium text-foreground">{buyer.name}</p>
                        <p className="text-xs text-muted-foreground">{buyer.location}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          buyer.interest === "Alta"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {buyer.interest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* AI Recommendations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recomendações Automáticas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card key={rec.title} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className={`w-6 h-6 ${rec.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {rec.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Impacto Estimado</p>
                    <p className="text-sm font-bold text-primary">
                      {rec.impact}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Buyer Matching */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Correspondência com Compradores
          </h2>
          <div className="space-y-4">
            {buyerMatches.map((buyer, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {buyer.company}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {buyer.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Última Compra</p>
                      <p className="font-medium text-foreground">
                        {new Date(buyer.lastPurchase).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs">Total Gasto</p>
                      <p className="font-medium text-foreground">
                        {buyer.totalSpent}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {buyer.match}
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Contatar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}