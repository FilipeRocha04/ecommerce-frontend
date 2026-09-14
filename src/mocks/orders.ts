import type { Order, OrderStatus } from "@/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pagamento_aprovado: "Pagamento aprovado",
  separando: "Separando pedido",
  enviado: "Enviado",
  saiu_para_entrega: "Saiu para entrega",
  entregue: "Entregue",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pagamento_aprovado",
  "separando",
  "enviado",
  "saiu_para_entrega",
  "entregue",
];

export const ORDERS: Order[] = [
  {
    id: "o1",
    number: "#AP874321",
    date: "02/09/2026",
    status: "saiu_para_entrega",
    total: 249.8,
    items: [
      { productId: "pastilha-bosch-diant", quantity: 1 },
      { productId: "oleo-shell-hx8", quantity: 1 },
    ],
    payment: "Pix",
    address: "Rua das Palmeiras, 245 — São Paulo/SP",
    eta: "10/09/2026",
  },
  {
    id: "o2",
    number: "#AP871204",
    date: "18/08/2026",
    status: "entregue",
    total: 432.7,
    items: [
      { productId: "amortecedor-cofap-diant", quantity: 1 },
      { productId: "kit-batente-monroe", quantity: 1 },
    ],
    payment: "Cartão de crédito 6x",
    address: "Rua das Palmeiras, 245 — São Paulo/SP",
    eta: "23/08/2026",
  },
  {
    id: "o3",
    number: "#AP869877",
    date: "04/08/2026",
    status: "entregue",
    total: 147.7,
    items: [
      { productId: "filtro-oleo-mann", quantity: 1 },
      { productId: "filtro-ar-tecfil", quantity: 1 },
      { productId: "vela-ngk-iridium", quantity: 1 },
    ],
    payment: "Boleto",
    address: "Rua das Palmeiras, 245 — São Paulo/SP",
    eta: "12/08/2026",
  },
];
