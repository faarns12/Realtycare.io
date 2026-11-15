import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/product", "/pricing", "/calculator", "/book", "/privacy", "/terms"].map((p) => ({
    url: site.url + p,
    lastModified: new Date(),
  }));
}
