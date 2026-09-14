import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={className ?? "rounded-md p-2 hover:bg-accent"}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
