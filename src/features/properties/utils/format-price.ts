const nairaFormatter = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatPrice(price: number) {
  return nairaFormatter.format(price);
}
