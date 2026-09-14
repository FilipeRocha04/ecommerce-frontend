export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function installment(value: number, times = 6) {
  return `em até ${times}x de ${brl(value / times)} sem juros`;
}
