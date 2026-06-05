import { formatPrice as sharedFormatPrice } from "@/lib/format-price";

export function formatPrice(price: number, rentPeriod: string = "yearly") {
  return sharedFormatPrice(price, rentPeriod);
}
