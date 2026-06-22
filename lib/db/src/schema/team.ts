import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const teamTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  roleTr: text("role_tr"),
  roleEn: text("role_en"),
  bio: text("bio"),
  bioTr: text("bio_tr"),
  bioEn: text("bio_en"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  order: integer("order").notNull().default(0),
});

export const insertTeamMemberSchema = createInsertSchema(teamTable).omit({ id: true });
export const updateTeamMemberSchema = insertTeamMemberSchema.partial();
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;
export type TeamMember = typeof teamTable.$inferSelect;
