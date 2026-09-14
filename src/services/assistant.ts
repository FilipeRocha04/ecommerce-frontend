import { PRODUCTS, categoryName } from "@/mocks/products";
import type { CategorySlug, Product, Vehicle } from "@/types";
import { VEHICLE_DB, getModelInfo, getModels } from "@/mocks/vehicles";

export interface AssistantReply {
  text: string;
  products?: Product[];
  suggestions?: string[];
  detectedVehicle?: Vehicle;
  addToCart?: string;
}

const CATEGORY_KEYWORDS: { slug: CategorySlug; words: string[] }[] = [
  {
    slug: "freios",
    words: ["freio", "freios", "pastilha", "pastilhas", "disco", "frear", "freando"],
  },
  {
    slug: "suspensao",
    words: ["suspensão", "suspensao", "amortecedor", "mola", "batente", "barulho na rua"],
  },
  {
    slug: "motor",
    words: ["motor", "vela", "velas", "correia", "bomba d'água", "sincronismo", "ignição"],
  },
  { slug: "filtros", words: ["filtro", "filtros", "ar-condicionado", "cabine", "combustível"] },
  {
    slug: "eletrica",
    words: ["bateria", "elétrica", "eletrica", "bobina", "sensor", "abs", "alternador"],
  },
  {
    slug: "oleos",
    words: ["óleo", "oleo", "lubrificante", "fluido", "aditivo", "radiador", "troca de óleo"],
  },
  { slug: "iluminacao", words: ["lâmpada", "lampada", "farol", "led", "iluminação", "luz"] },
  { slug: "acessorios", words: ["palheta", "limpador", "tapete", "acessório", "acessorio"] },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function detectCategory(text: string): CategorySlug | null {
  const t = normalize(text);
  for (const c of CATEGORY_KEYWORDS) {
    if (c.words.some((w) => t.includes(normalize(w)))) return c.slug;
  }
  return null;
}

export function detectVehicle(text: string): Vehicle | null {
  const t = normalize(text);
  for (const brand of Object.keys(VEHICLE_DB)) {
    for (const model of Object.keys(getModels(brand))) {
      if (t.includes(normalize(model))) {
        const info = getModelInfo(brand, model);
        if (!info) continue;
        const yearMatch = t.match(/(19|20)\d{2}/);
        const lastYear = info.years[info.years.length - 1] ?? new Date().getFullYear();
        const year = yearMatch ? Number(yearMatch[0]) : lastYear;
        const engineMatch = t.match(/\d\.\d/);
        const engine =
          info.engines.find((e) => engineMatch && e.startsWith(engineMatch[0])) ??
          info.engines[0] ??
          "";
        return { id: `detected-${brand}-${model}`, brand, model, year, engine };
      }
    }
  }
  return null;
}

function findProducts(category: CategorySlug | null, vehicle: Vehicle | null, limit = 3) {
  let list = PRODUCTS;
  if (category) list = list.filter((p) => p.category === category);
  if (vehicle) {
    const key = `${vehicle.brand} ${vehicle.model}`.toLowerCase();
    const compat = list.filter((p) => p.fitment.includes(key));
    if (compat.length) list = compat;
  }
  return list.slice(0, limit);
}

export function greeting(): AssistantReply {
  return {
    text: "Olá! 👋 Sou seu assistente de compras da AutoParts.\n\nPosso te ajudar a encontrar a peça certa para o seu carro. O que você está procurando?",
    suggestions: [
      "Preciso de pastilhas de freio para um Gol 1.6 2020",
      "Óleo para Civic 2018",
      "Preciso trocar os filtros do meu carro",
      "Meu carro faz barulho quando freio",
    ],
  };
}

export function respond(
  message: string,
  vehicle: Vehicle | null,
  lastProducts: Product[],
): AssistantReply {
  const t = normalize(message);
  const detected = detectVehicle(message);
  const activeVehicle = detected ?? vehicle;

  // add to cart intent
  if (/(coloca|colocar|adiciona|adicionar|quero|pode por|põe|poe)/.test(t) && lastProducts.length) {
    const chosen =
      lastProducts.find((p) => t.includes(normalize(p.brand))) ??
      (t.includes("primeir") ? lastProducts[0] : null) ??
      (t.includes("mais barat") ? [...lastProducts].sort((a, b) => a.price - b.price)[0] : null);
    if (chosen) {
      return {
        text: `Adicionado! 🛒\n\n${chosen.name}\nQuantidade: 1\n${chosen.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
        addToCart: chosen.id,
        suggestions: ["Ver carrinho", "Continuar comprando"],
      };
    }
  }

  // recommendation intent
  if (
    /(recomenda|indica|qual.*melhor|qual voce|qual você|diferenca|diferença|vale a pena)/.test(t) &&
    lastProducts[0]
  ) {
    const [a, b] = lastProducts;
    if (!a) return respond("", vehicle, []);
    return {
      text: `A ${a.brand} tem ótima durabilidade e é uma escolha segura para uso diário — nota ${a.rating} com ${a.reviewsCount} avaliações.${
        b
          ? ` A ${b.brand} também é uma excelente alternativa e custa um pouco menos (${b.price < a.price ? "economia de " + (a.price - b.price).toFixed(2).replace(".", ",") + " reais" : "preço parecido"}).`
          : ""
      }\n\nQuer que eu adicione alguma delas ao carrinho?`,
      products: lastProducts.slice(0, 2),
      suggestions: [
        `Pode colocar a ${a.brand} no carrinho`,
        b ? `Prefiro a ${b.brand}` : "Ver mais opções",
      ].filter(Boolean) as string[],
    };
  }

  // symptom intent
  if (/barulho|chiado|rangendo|vibra|tremendo/.test(t)) {
    const category: CategorySlug = /frea|freio/.test(t) ? "freios" : "suspensao";
    const products = findProducts(category, activeVehicle);
    return {
      text: `Barulho desse tipo costuma indicar desgaste ${
        category === "freios"
          ? "das pastilhas ou dos discos de freio"
          : "dos amortecedores ou batentes da suspensão"
      }. Separei as peças mais indicadas${activeVehicle ? ` para o seu ${activeVehicle.brand} ${activeVehicle.model} ${activeVehicle.year}` : ""}:`,
      products,
      ...(detected ? { detectedVehicle: detected } : {}),
      suggestions: ["Qual você recomenda?", "Tem opção mais barata?"],
    };
  }

  const category = detectCategory(message);

  if (category) {
    const products = findProducts(category, activeVehicle);
    return {
      text: activeVehicle
        ? `Encontrei ${products.length} opções de ${categoryName(category).toLowerCase()} compatíveis com o seu ${activeVehicle.brand} ${activeVehicle.model} ${activeVehicle.engine} ${activeVehicle.year}.`
        : `Encontrei estas opções em ${categoryName(category).toLowerCase()}. Me diga o modelo e o ano do seu carro que eu confirmo a compatibilidade.`,
      products,
      ...(detected ? { detectedVehicle: detected } : {}),
      suggestions: ["Qual você recomenda?", "Pode colocar a primeira no carrinho"],
    };
  }

  if (detected) {
    return {
      text: `Perfeito, anotei: ${detected.brand} ${detected.model} ${detected.engine} ${detected.year}. Do que você precisa para ele?`,
      detectedVehicle: detected,
      suggestions: ["Pastilhas de freio", "Troca de óleo e filtros", "Amortecedores"],
    };
  }

  if (/carrinho|finalizar|comprar/.test(t)) {
    return {
      text: "Seu carrinho está do lado direito da conversa. Quando quiser, é só finalizar a compra — eu continuo por aqui se precisar de mais alguma peça.",
      suggestions: ["Ver carrinho", "Preciso de mais uma peça"],
    };
  }

  return {
    text: "Posso te ajudar melhor com o modelo e o ano do carro e a peça que você precisa. Por exemplo: “pastilhas de freio para um Gol 1.6 2020”.",
    suggestions: [
      "Pastilhas de freio para Gol 2020",
      "Óleo para Civic 2018",
      "Filtros para Onix 2021",
    ],
  };
}
