import { Router } from "express";
import { db, teamTable, insertTeamMemberSchema, updateTeamMemberSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/team", async (req, res) => {
  try {
    const members = await db.select().from(teamTable).orderBy(teamTable.order, teamTable.id);
    res.json(members);
  } catch (err) {
    req.log.error({ err }, "Failed to list team members");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/team", async (req, res) => {
  const parsed = insertTeamMemberSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  try {
    const [member] = await db.insert(teamTable).values(parsed.data).returning();
    res.status(201).json(member);
  } catch (err) {
    req.log.error({ err }, "Failed to create team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/team/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = updateTeamMemberSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  try {
    const [member] = await db.update(teamTable).set(parsed.data).where(eq(teamTable.id, id)).returning();
    if (!member) { res.status(404).json({ error: "Not found" }); return; }
    res.json(member);
  } catch (err) {
    req.log.error({ err }, "Failed to update team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/team/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(teamTable).where(eq(teamTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
