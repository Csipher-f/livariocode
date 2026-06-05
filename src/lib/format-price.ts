const nairaFormatter = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatPrice(price: number, rentPeriod: string): string {
  const formattedPrice = nairaFormatter.format(price);

  switch (rentPeriod) {
    case "monthly":
      return `${formattedPrice}/mo`;
    case "six_months":
      return `${formattedPrice}/6mo`;
    case "yearly":
    default:
      return `${formattedPrice}/yr`;
  }
}
