import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/cotizar", "/empty-legs", "/pools", "/como-funciona", "/faq", "/black"].map((path) => ({ url: `https://blajet.com${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path ? .8 : 1 })); }
