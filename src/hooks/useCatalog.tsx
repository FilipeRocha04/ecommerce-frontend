import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Category, Product } from "@/types";
import { backend } from "@/services/backend/client";
import { toCategory, toProduct } from "@/services/backend/adapters";
import type { CategoriaResposta, VarianteVeiculoResposta } from "@/services/backend/types";

export interface FabricanteArvore {
  nome: string;
  modelos: Record<string, VarianteVeiculoResposta[]>;
}

interface CatalogValue {
  products: Product[];
  categories: Category[];
  brands: string[];
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
  categoryName: (slug: string) => string;
  categoriasPorId: Map<string, CategoriaResposta>;
  vehicleTree: Record<string, FabricanteArvore>;
  vehicleBrands: string[];
}

const CatalogContext = createContext<CatalogValue | null>(null);

const PAGE_SIZE = 100;

export function CatalogProvider({ children }: { children: ReactNode }) {
  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: () => backend.categorias.listar(),
    staleTime: 5 * 60 * 1000,
  });

  const marcasQuery = useQuery({
    queryKey: ["marcas"],
    queryFn: () => backend.marcas.listar({ tamanho_pagina: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
  });

  const produtosQuery = useQuery({
    queryKey: ["produtos", "todos"],
    queryFn: () => backend.produtos.listar({ tamanho_pagina: PAGE_SIZE }),
    staleTime: 60 * 1000,
  });

  const variantesQuery = useQuery({
    queryKey: ["veiculos", "variantes"],
    queryFn: () => backend.veiculos.variantes(),
    staleTime: 5 * 60 * 1000,
  });

  const categoriasPorId = useMemo(() => {
    const mapa = new Map<string, CategoriaResposta>();
    for (const c of categoriasQuery.data ?? []) mapa.set(c.id, c);
    return mapa;
  }, [categoriasQuery.data]);

  const categories = useMemo(() => {
    const raizes = (categoriasQuery.data ?? []).filter((c) => c.categoria_pai_id === null);
    return raizes.map(toCategory);
  }, [categoriasQuery.data]);

  const categoryNameBySlug = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const c of categories) mapa.set(c.slug, c.name);
    return mapa;
  }, [categories]);

  const products = useMemo(() => {
    return (produtosQuery.data?.itens ?? []).map((p) => toProduct(p, categoriasPorId));
  }, [produtosQuery.data, categoriasPorId]);

  const productsById = useMemo(() => {
    const mapa = new Map<string, Product>();
    for (const p of products) mapa.set(p.id, p);
    return mapa;
  }, [products]);

  const brands = useMemo(
    () => (marcasQuery.data?.itens ?? []).map((m) => m.nome).sort(),
    [marcasQuery.data],
  );

  const vehicleTree = useMemo(() => {
    const arvore: Record<string, FabricanteArvore> = {};
    for (const v of variantesQuery.data ?? []) {
      const fabricante = (arvore[v.fabricante_nome] ??= { nome: v.fabricante_nome, modelos: {} });
      (fabricante.modelos[v.modelo_nome] ??= []).push(v);
    }
    return arvore;
  }, [variantesQuery.data]);

  const vehicleBrands = useMemo(() => Object.keys(vehicleTree).sort(), [vehicleTree]);

  const getProduct = useCallback((id: string) => productsById.get(id), [productsById]);
  const categoryName = useCallback(
    (slug: string) => categoryNameBySlug.get(slug) ?? slug,
    [categoryNameBySlug],
  );

  const value: CatalogValue = {
    products,
    categories,
    brands,
    loading: categoriasQuery.isLoading || produtosQuery.isLoading || marcasQuery.isLoading,
    getProduct,
    categoryName,
    categoriasPorId,
    vehicleTree,
    vehicleBrands,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog precisa estar dentro de CatalogProvider");
  return ctx;
}
