import { Router } from "express";
import { db, siteContentTable, updateSiteContentSchema } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

async function ensureSiteContent() {
  const rows = await db.select().from(siteContentTable);
  if (rows.length === 0) {
    const [row] = await db.insert(siteContentTable).values({}).returning();
    return row;
  }
  return rows[0];
}

router.get("/site-content", async (req, res) => {
  try {
    const content = await ensureSiteContent();
    res.json(content);
  } catch (err) {
    req.log.error({ err }, "Failed to get site content");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/site-content", async (req, res) => {
  const parsed = updateSiteContentSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  try {
    const content = await ensureSiteContent();
    const [updated] = await db.update(siteContentTable).set(parsed.data).where(eq(siteContentTable.id, content.id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update site content");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/site-content/track-visit", async (req, res) => {
  try {
    const content = await ensureSiteContent();
    await db.update(siteContentTable)
      .set({ totalVisits: sql`${siteContentTable.totalVisits} + 1` })
      .where(eq(siteContentTable.id, content.id));
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

export default router;
