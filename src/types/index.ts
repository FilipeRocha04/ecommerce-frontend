export type CategorySlug =
  "freios" | "suspensao" | "motor" | "filtros" | "eletrica" | "oleos" | "iluminacao" | "acessorios";

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  primary?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  installments: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  partCode: string;
  warranty: string;
  description: string;
  specs: { label: string; value: string }[];
  /** keys are `${brand} ${model}` in lowercase */
  fitment: string[];
  image: string;
  reviews: Review[];
  complements?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  "pagamento_aprovado" | "separando" | "enviado" | "saiu_para_entrega" | "entregue";

export interface Order {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { productId: string; quantity: number }[];
  payment: string;
  address: string;
  eta: string;
}

export type Channel = "web" | "assistant";
