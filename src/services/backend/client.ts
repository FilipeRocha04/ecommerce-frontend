import type {
  CarrinhoResposta,
  CategoriaResposta,
  CompatibilidadeResposta,
  ErroResposta,
  EstoqueResposta,
  FabricanteVeiculoResposta,
  MarcaResposta,
  ModeloVeiculoResposta,
  PaginaResposta,
  ProdutoResposta,
  VarianteVeiculoResposta,
} from "./types";

const BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public codigo: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const corpo = (await response.json().catch(() => null)) as ErroResposta | null;
    throw new ApiError(
      response.status,
      corpo?.erro ?? "erro_desconhecido",
      corpo?.mensagem ?? `Falha na requisição (${response.status})`,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export const backend = {
  categorias: {
    listar: () => apiFetch<CategoriaResposta[]>("/api/v1/categorias"),
  },
  marcas: {
    listar: (params: { pagina?: number; tamanho_pagina?: number } = {}) =>
      apiFetch<PaginaResposta<MarcaResposta>>(`/api/v1/marcas${qs(params)}`),
  },
  produtos: {
    listar: (
      params: {
        pagina?: number;
        tamanho_pagina?: number;
        categoria_id?: string;
        marca_id?: string;
        preco_minimo?: number;
        preco_maximo?: number;
        veiculo?: string;
      } = {},
    ) => apiFetch<PaginaResposta<ProdutoResposta>>(`/api/v1/produtos${qs(params)}`),
    buscar: (q: string, params: { pagina?: number; tamanho_pagina?: number } = {}) =>
      apiFetch<PaginaResposta<ProdutoResposta>>(`/api/v1/produtos/buscar${qs({ q, ...params })}`),
    obter: (id: string) => apiFetch<ProdutoResposta>(`/api/v1/produtos/${id}`),
    estoque: (id: string) => apiFetch<EstoqueResposta>(`/api/v1/produtos/${id}/estoque`),
  },
  veiculos: {
    fabricantes: () => apiFetch<FabricanteVeiculoResposta[]>("/api/v1/veiculos/fabricantes"),
    modelos: (fabricante_id?: string) =>
      apiFetch<ModeloVeiculoResposta[]>(`/api/v1/veiculos/modelos${qs({ fabricante_id })}`),
    variantes: (
      params: { fabricante?: string; modelo?: string; ano?: number; motor?: string } = {},
    ) => apiFetch<VarianteVeiculoResposta[]>(`/api/v1/veiculos/variantes${qs(params)}`),
  },
  compatibilidade: {
    verificar: (produto_id: string, variante_veiculo_id: string) =>
      apiFetch<CompatibilidadeResposta>(
        `/api/v1/compatibilidade${qs({ produto_id, variante_veiculo_id })}`,
      ),
  },
  carrinhos: {
    criar: (dados: { sessao_id?: string; canal?: "web" | "assistente" }) =>
      apiFetch<CarrinhoResposta>("/api/v1/carrinhos", {
        method: "POST",
        body: JSON.stringify(dados),
      }),
    obter: (id: string) => apiFetch<CarrinhoResposta>(`/api/v1/carrinhos/${id}`),
    adicionarItem: (carrinhoId: string, produto_id: string, quantidade: number) =>
      apiFetch<CarrinhoResposta>(`/api/v1/carrinhos/${carrinhoId}/itens`, {
        method: "POST",
        body: JSON.stringify({ produto_id, quantidade }),
      }),
    atualizarItem: (carrinhoId: string, itemId: string, quantidade: number) =>
      apiFetch<CarrinhoResposta>(`/api/v1/carrinhos/${carrinhoId}/itens/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantidade }),
      }),
    removerItem: (carrinhoId: string, itemId: string) =>
      apiFetch<CarrinhoResposta>(`/api/v1/carrinhos/${carrinhoId}/itens/${itemId}`, {
        method: "DELETE",
      }),
  },
};
