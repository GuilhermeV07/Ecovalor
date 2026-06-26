import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function AIInsights() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedResidue, setSelectedResidue] = useState("");
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const residues = [
    { id: 1, name: "Cavaco de Madeira", category: "Madeira", quantity: 500 },
    { id: 2, name: "Sucata de Aço", category: "Metal", quantity: 1200 },
    { id: 3, name: "Alumínio Reciclado", category: "Alumínio", quantity: 300 },
  ];

  const handleAnalyzePrice = async () => {
    if (!selectedResidue) return;

    setLoading(true);
    setTimeout(() => {
      setPriceAnalysis({
        residueName: "Cavaco de Madeira",
        currentPrice: 15,
        suggestedPrice: 18.5,
        confidence: 0.87,
        reasoning:
          "Baseado em análise de mercado, demanda crescente e qualidade do material",
        potentialBuyers: [
          { name: "ABC Indústria", interest: "Alta", location: "São Paulo" },
          { name: "XYZ Ltda", interest: "Média", location: "Belo Horizonte" },
          { name: "Tech Industries", interest: "Alta", location: "Rio de Janeiro" },
        ],
        estimatedRevenue: 9250,
        estimatedProfit: 3700,
        co2Impact: 25,
        marketTrend: "upward",
      });
      setLoading(false);
    }, 1500);
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
            Análises inteligentes para maximizar seus lucros e impacto ambiental
          </p>
        </div>

        {/* Price Suggestion Tool */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Sugestor de Preços com IA
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Receba recomendações de preço baseadas em análise de mercado em tempo real
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="residue" className="text-sm font-semibold">
                Selecione um Resíduo
              </Label>
              <Select value={selectedResidue} onValueChange={setSelectedResidue}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Escolha um resíduo para análise" />
                </SelectTrigger>
                <SelectContent>
                  {residues.map((residue) => (
                    <SelectItem key={residue.id} value={residue.id.toString()}>
                      {residue.name} ({residue.quantity} kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={handleAnalyzePrice}
              disabled={!selectedResidue || loading}
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Analisando..." : "Analisar Preço com IA"}
            </Button>
          </div>

          {priceAnalysis && (
            <div className="mt-8 space-y-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Preço Atual</p>
                  <p className="text-3xl font-bold text-foreground">
                    R$ {priceAnalysis.currentPrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                    Preço Sugerido
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
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${priceAnalysis.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Análise
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
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
                  Compradores em Potencial
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
            Recomendações de IA
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