import { Router } from "express";
import { db, gamesTable, insertGameSchema, updateGameSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/games", async (req, res) => {
  try {
    const games = await db.select().from(gamesTable).orderBy(gamesTable.order, gamesTable.id);
    res.json(games);
  } catch (err) {
    req.log.error({ err }, "Failed to list games");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/games", async (req, res) => {
  const parsed = insertGameSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const [game] = await db.insert(gamesTable).values(parsed.data).returning();
    res.status(201).json(game);
  } catch (err) {
    req.log.error({ err }, "Failed to create game");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/games/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [game] = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
    if (!game) { res.status(404).json({ error: "Not found" }); return; }
    res.json(game);
  } catch (err) {
    req.log.error({ err }, "Failed to get game");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/games/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = updateGameSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  try {
    const [game] = await db.update(gamesTable).set(parsed.data).where(eq(gamesTable.id, id)).returning();
    if (!game) { res.status(404).json({ error: "Not found" }); return; }
    res.json(game);
  } catch (err) {
    req.log.error({ err }, "Failed to update game");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/games/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(gamesTable).where(eq(gamesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete game");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
