// Tipos espelhando as respostas da API FastAPI (backend/app/schemas).
// Mantidos separados dos tipos de UI em `@/types`, que são adaptados a partir destes.

export interface PaginaResposta<T> {
  itens: T[];
  pagina: number;
  tamanho_pagina: number;
  total: number;
  total_paginas: number;
}

export interface MarcaResposta {
  id: string;
  nome: string;
  slug: string;
  created_at: string;
}

export interface CategoriaResposta {
  id: string;
  categoria_pai_id: string | null;
  nome: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ImagemProdutoResposta {
  id: string;
  url: string;
  posicao: number;
}

export interface EspecificacaoProdutoResposta {
  especificacoes: Record<string, unknown>;
}

export interface ProdutoResposta {
  id: string;
  sku: string;
  marca_id: string;
  categoria_id: string;
  marca: MarcaResposta;
  categoria: CategoriaResposta;
  nome: string;
  slug: string;
  descricao: string;
  codigo_peca: string;
  preco: string;
  preco_promocional: string | null;
  meses_garantia: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  imagens: ImagemProdutoResposta[];
  especificacao: EspecificacaoProdutoResposta | null;
}

export interface FabricanteVeiculoResposta {
  id: string;
  nome: string;
  created_at: string;
}

export interface ModeloVeiculoResposta {
  id: string;
  fabricante_id: string;
  nome: string;
  created_at: string;
}

export interface VarianteVeiculoResposta {
  id: string;
  modelo_id: string;
  fabricante_nome: string;
  modelo_nome: string;
  ano_inicio: number;
  ano_fim: number;
  motor: string;
  versao: string | null;
  combustivel: string;
  cambio: string;
  created_at: string;
  updated_at: string;
}

export interface EstoqueResposta {
  produto_id: string;
  quantidade: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
}

export interface CompatibilidadeResposta {
  compativel: boolean;
  produto_id: string;
  variante_veiculo_id: string;
}

export interface CarrinhoItemResposta {
  id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: string;
  created_at: string;
  updated_at: string;
}

export interface CarrinhoResposta {
  id: string;
  usuario_id: string | null;
  sessao_id: string | null;
  status: "ativo" | "convertido" | "abandonado";
  canal: "web" | "assistente";
  created_at: string;
  updated_at: string;
  itens: CarrinhoItemResposta[];
}

export interface ErroResposta {
  erro: string;
  mensagem: string;
}

export interface MensagemChat {
  role: "user" | "assistant";
  content: string;
}

export interface AssistenteConversarRequest {
  mensagem: string;
  historico?: MensagemChat[];
  carrinho_id?: string;
  variante_veiculo_id?: string;
}

export interface AssistenteConversarResposta {
  resposta: string;
  produtos: ProdutoResposta[];
  carrinho: CarrinhoResposta | null;
}
