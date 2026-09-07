import type { SchemaTypeDefinition } from "sanity";

import { author } from "./author";
import { category } from "./category";
import { faq } from "./faq";
import { blockContent } from "./objects/blockContent";
import { callout } from "./objects/callout";
import { cta } from "./objects/cta";
import { inlineImage } from "./objects/inlineImage";
import { seo } from "./objects/seo";
import { simpleBlockContent } from "./objects/simpleBlockContent";
import { post } from "./post";
import { siteSettings } from "./siteSettings";

/**
 * Alle Schema-Typen der GolfNext-Website (docs/04-sanity-content-modell.md).
 * Reihenfolge: Dokumenttypen zuerst, dann die wiederverwendeten Objekttypen.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  faq,
  siteSettings,
  blockContent,
  simpleBlockContent,
  callout,
  cta,
  inlineImage,
  seo,
];
