export function money(n: number): string {
  return '$' + n.toLocaleString('es-AR');
}

export function boxLabel(qty: number, priceBox: number): string {
  return `x${qty}: ${money(priceBox)}`;
}
