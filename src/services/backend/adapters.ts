import type { Category, CategorySlug, Product, Review } from "@/types";
import { CATEGORY_IMAGES } from "@/mocks/products";
import type { CategoriaResposta, ProdutoResposta } from "./types";

const KNOWN_CATEGORY_SLUGS = new Set<CategorySlug>([
  "freios",
  "suspensao",
  "motor",
  "filtros",
  "eletrica",
  "oleos",
  "iluminacao",
  "acessorios",
]);

function isCategorySlug(slug: string): slug is CategorySlug {
  return KNOWN_CATEGORY_SLUGS.has(slug as CategorySlug);
}

const FALLBACK_CATEGORY_SLUG: CategorySlug = "acessorios";
const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e5e5'/%3E%3C/svg%3E";

function fakeReviews(seed: string, count: number): Review[] {
  const authors = ["Marcos A.", "Juliana P.", "Ricardo S.", "Fernanda L."];
  return Array.from({ length: count }, (_, i) => ({
    id: `${seed}-r${i}`,
    author: authors[i % authors.length] ?? authors[0]!,
    rating: 4 + (i % 2),
    date: "—",
    comment: "Peça de reposição de acordo com a especificação do fabricante.",
  }));
}

/** Resolve o slug da categoria-raiz (nível topo da hierarquia) a partir de uma categoria folha. */
export function categoriaRaizSlug(
  categoria: CategoriaResposta,
  categoriasPorId: Map<string, CategoriaResposta>,
): CategorySlug {
  let atual: CategoriaResposta | undefined = categoria;
  const visitados = new Set<string>();
  while (atual?.categoria_pai_id && !visitados.has(atual.id)) {
    visitados.add(atual.id);
    atual = categoriasPorId.get(atual.categoria_pai_id);
  }
  const slug = atual?.slug ?? categoria.slug;
  return isCategorySlug(slug) ? slug : FALLBACK_CATEGORY_SLUG;
}

export function toCategory(categoria: CategoriaResposta): Category {
  const slug = isCategorySlug(categoria.slug) ? categoria.slug : FALLBACK_CATEGORY_SLUG;
  return {
    slug,
    name: categoria.nome,
    image: CATEGORY_IMAGES[slug],
  };
}

export function toProduct(
  produto: ProdutoResposta,
  categoriasPorId: Map<string, CategoriaResposta>,
): Product {
  const preco = produto.preco_promocional ?? produto.preco;
  const precoOriginal = produto.preco_promocional ? produto.preco : undefined;
  const especificacoes = produto.especificacao?.especificacoes ?? {};

  return {
    id: produto.id,
    name: produto.nome,
    brand: produto.marca.nome,
    category: categoriaRaizSlug(produto.categoria, categoriasPorId),
    price: Number(preco),
    ...(precoOriginal ? { oldPrice: Number(precoOriginal) } : {}),
    installments: 12,
    rating: 4.5,
    reviewsCount: 12,
    stock: 1,
    partCode: produto.codigo_peca,
    warranty:
      produto.meses_garantia > 0 ? `${produto.meses_garantia} meses` : "Sem garantia estendida",
    description: produto.descricao,
    specs: Object.entries(especificacoes).map(([label, value]) => ({
      label,
      value: String(value),
    })),
    fitment: [],
    image: produto.imagens[0]?.url ?? FALLBACK_PRODUCT_IMAGE,
    reviews: fakeReviews(produto.id, 2),
  };
}
