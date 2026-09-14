import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/useStore";
import { greeting, respond } from "@/services/assistant";
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
  suggestions?: string[] | undefined;
}

let seq = 0;
function nextId() {
  seq += 1;
  return `m${seq}`;
}

function AssistantPage() {
  const { setVehicle, addToCart } = useStore();
  const [messages, setMessages] = useState<Message[]>(() => {
    const g = greeting();
    return [{ id: nextId(), role: "assistant", text: g.text, suggestions: g.suggestions }];
  });
  const [lastProducts, setLastProducts] = useState<Product[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("assistant_started");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;
    track("assistant_message_sent", { text });
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setInput("");

    const reply = respond(text, null, lastProducts);
    if (reply.detectedVehicle) setVehicle(reply.detectedVehicle);
    if (reply.products?.length) {
      setLastProducts(reply.products);
      track("assistant_product_recommended", { productIds: reply.products.map((p) => p.id) });
    }
    if (reply.addToCart) {
      addToCart(reply.addToCart, 1, "assistant");
      toast.success("Adicionado ao carrinho");
    }

    setMessages((m) => [
      ...m,
      {
        id: nextId(),
        role: "assistant",
        text: reply.text,
        products: reply.products,
        suggestions: reply.suggestions,
      },
    ]);
  }

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

              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {m.suggestions.map((s) => (
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
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          className="flex gap-2 border-t border-border pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: pastilhas de freio para um Gol 1.6 2020"
            aria-label="Mensagem para o assistente"
          />
          <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}
