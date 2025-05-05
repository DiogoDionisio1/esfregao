import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  // Garantir que o valor tem precisão adequada
  // Usamos Math.round(value * 100) / 100 para evitar problemas de arredondamento com números de ponto flutuante
  const fixedValue = Math.round(value * 100) / 100

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fixedValue)
}
