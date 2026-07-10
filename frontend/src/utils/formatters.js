// Format a price in Qatari Riyal.
export function formatPrice(amount) {
  return `QAR ${Number(amount).toFixed(0)}`;
}
