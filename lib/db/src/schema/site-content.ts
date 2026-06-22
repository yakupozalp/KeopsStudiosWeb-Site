import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  heroTitleTr: text("hero_title_tr").default("Büyük Oyunlar İnşa Ediyoruz"),
  heroTitleEn: text("hero_title_en").default("We Build Great Games"),
  heroSubtitleTr: text("hero_subtitle_tr").default("Mobil ve PC platformları için tutkuyla geliştirilen oyunlar"),
  heroSubtitleEn: text("hero_subtitle_en").default("Games crafted with passion for mobile and PC platforms"),
  aboutTr: text("about_tr").default("Keops Studios, 2022 yılında kurulmuş bağımsız bir oyun stüdyosudur. Mısır piramitlerinden ilham alarak, kalıcı ve güçlü oyun deneyimleri yaratmayı hedefliyoruz."),
  aboutEn: text("about_en").default("Keops Studios is an independent game studio founded in 2022. Inspired by the Egyptian pyramids, we aim to create lasting and powerful gaming experiences."),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  discordUrl: text("discord_url"),
  email: text("email").default("info@keops.studio"),
});

export const insertSiteContentSchema = createInsertSchema(siteContentTable).omit({ id: true });
export const updateSiteContentSchema = insertSiteContentSchema.partial();
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type UpdateSiteContent = z.infer<typeof updateSiteContentSchema>;
export type SiteContent = typeof siteContentTable.$inferSelect;
