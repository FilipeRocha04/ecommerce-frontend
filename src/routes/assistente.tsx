import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, MessageSquareText } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/useStore";
import { useCatalog } from "@/hooks/useCatalog";
import { backend, ApiError } from "@/services/backend/client";
import { toProduct } from "@/services/backend/adapters";
import { track } from "@/services/tracking";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export const Route = createFileRoute("/assistente")({
  component: AssistantPage,
});

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  products?: Product[] | undefined;
}

const SUGESTOES_INICIAIS = [
  "Preciso de pastilhas de freio para um Gol 1.6 2020",
  "Óleo para Civic 2018",
  "Preciso trocar os filtros do meu carro",
  "Meu carro faz barulho quando freio",
];

let seq = 0;
function nextId() {
  seq += 1;
  return `m${seq}`;
}

function AssistantPage() {
  const { vehicle, carrinhoId, sincronizarCarrinho } = useStore();
  const { categoriasPorId } = useCatalog();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: nextId(),
      role: "assistant",
      text: "Olá! 👋 Sou seu assistente de compras da AutoParts.\n\nPosso te ajudar a encontrar a peça certa para o seu carro. O que você está procurando?",
    },
  ]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("assistant_started");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enviando]);

  async function send(text: string) {
    if (!text.trim() || enviando) return;
    track("assistant_message_sent", { text });

    const historico = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setInput("");
    setEnviando(true);

    try {
      const resposta = await backend.assistente.conversar({
        mensagem: text,
        historico,
        ...(carrinhoId ? { carrinho_id: carrinhoId } : {}),
        ...(vehicle?.varianteId ? { variante_veiculo_id: vehicle.varianteId } : {}),
      });

      if (resposta.carrinho) sincronizarCarrinho(resposta.carrinho);

      const produtos = resposta.produtos.map((p) => toProduct(p, categoriasPorId));
      if (produtos.length) {
        track("assistant_product_recommended", { productIds: produtos.map((p) => p.id) });
      }

      setMessages((m) => [
        ...m,
        { id: nextId(), role: "assistant", text: resposta.resposta, products: produtos },
      ]);
    } catch (error) {
      const mensagemErro =
        error instanceof ApiError
          ? error.codigo === "assistente_nao_configurado"
            ? "O assistente de IA ainda não foi configurado no backend (falta a chave da OpenAI)."
            : error.message
          : "Não consegui falar com o assistente agora. Tente de novo em instantes.";
      setMessages((m) => [...m, { id: nextId(), role: "assistant", text: mensagemErro }]);
    } finally {
      setEnviando(false);
    }
  }

  const mostrarSugestoesIniciais = messages.length === 1;

  return (
    <SiteLayout hideFooter>
      <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col px-4 py-4 md:h-[calc(100vh-9.5rem)]">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <MessageSquareText className="size-5 text-brand" />
          <h1 className="text-base font-bold">Assistente de compras</h1>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex flex-col gap-2", m.role === "user" && "items-end")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-brand text-brand-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {m.text}
              </div>

              {m.products && m.products.length > 0 && (
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                  {m.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {mostrarSugestoesIniciais && (
            <div className="flex flex-wrap gap-2">
              {SUGESTOES_INICIAIS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-brand/40 px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {enviando && (
            <div className="max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
              Digitando...
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex gap-2 border-t border-border pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: pastilhas de freio para um Gol 1.6 2020"
            aria-label="Mensagem para o assistente"
            disabled={enviando}
          />
          <Button
            type="submit"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            disabled={enviando}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}
