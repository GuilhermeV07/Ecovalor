import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/_core/hooks/useAuth"; // Ajuste o caminho se necessário

interface AnunciarResiduoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AnunciarResiduoModal({ isOpen, onClose, onSuccess }: AnunciarResiduoModalProps) {
  // 🌟 Puxando o usuário logado diretamente do Contexto Global
  const { user } = useAuth();

  const [nomeMaterial, setNomeMaterial] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("kg");
  const [precoUnidade, setPrecoUnidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  
  // 📅 Calendário iniciando com a data de hoje padrão (YYYY-MM-DD)
  const [dataGeracao, setDataGeracao] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePublicarAnuncio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        alert("Você precisa estar logado para publicar um anúncio.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("residuos")
        .insert([
          {
            nome: nomeMaterial,
            categoria,
            quantidade: Number(quantidade),
            unidade,
            preco_unidade: Number(precoUnidade),
            localizacao: localizacao,
            user_id: authData.user.id,
            status: "Disponível",
            created_at: new Date(dataGeracao).toISOString(),
          },
        ]);

      if (error) throw error;

      alert("Anúncio ecológico publicado com sucesso!");
      
      // Limpa os campos do formulário
      setNomeMaterial("");
      setCategoria("");
      setQuantidade("");
      setPrecoUnidade("");
      setLocalizacao("");
      setDataGeracao(new Date().toISOString().split("T")[0]);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Erro ao salvar anúncio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Anunciar Resíduo Industrial</h2>
            <p className="text-sm text-gray-500 mt-0.5">Insira as especificações do lote para o mercado circular.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        <form onSubmit={handlePublicarAnuncio} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Material</label>
            <input
              type="text"
              required
              placeholder="Ex: Borra de Zinco Modificada"
              value={nomeMaterial}
              onChange={(e) => setNomeMaterial(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Plástico">Plástico</option>
              <option value="Papel/Papelão">Papel / Papelão</option>
              <option value="Vidro">Vidro</option>
              <option value="Metal/Serragem">Metal / Sucata</option>
              <option value="Químicos">Resíduos Químicos</option>
              <option value="Orgânico">Orgânico</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                type="number"
                required
                min="1"
                placeholder="500"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="kg">kg</option>
                <option value="t">t</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço por Unidade (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="12.50"
              value={precoUnidade}
              onChange={(e) => setPrecoUnidade(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização de Coleta</label>
            <input
              type="text"
              required
              placeholder="Ex: Campinas, SP"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* 📅 CALENDÁRIO NO MODAL */}
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <label className="block text-sm font-semibold text-emerald-900 mb-1">
              Data de Geração do Resíduo
            </label>
            <input
              type="date"
              required
              value={dataGeracao}
              onChange={(e) => setDataGeracao(e.target.value)}
              className="block w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-xs text-emerald-700 mt-1">
              Mude o mês aqui para que este peso seja contabilizado na coluna certa do gráfico!
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar Anúncio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}