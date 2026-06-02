import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://livario.com";
const defaultTitle = "Livario";
const defaultDescription =
  "Discover premium rentals and list quality homes across Nigeria with Livario.";
const defaultOgImage = "/images/listings/listing-1.svg";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Livario",
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: defaultOgImage }],
    locale: "en_NG",
    siteName: "Livario",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export function createPageMetadata({
  canonical,
  description,
  image,
  noIndex = false,
  title,
  type = "website",
}: {
  canonical?: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  title: string;
  type?: "website" | "article";
}): Metadata {
  const images = image ? [{ url: image }] : baseMetadata.openGraph?.images;

  return {
    title,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      images,
      type,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: image ? [image] : baseMetadata.twitter?.images,
    },
    robots: noIndex
      ? {
          follow: false,
          index: false,
        }
      : undefined,
  };
}
