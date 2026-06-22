import { Router } from "express";
import { db, gamesTable, teamTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "keops2024";

const sessions = new Set<string>();

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

router.post("/admin/login", (req, res) => {
  const { password } = req.body ?? {};
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = generateToken();
  sessions.add(token);
  res.cookie("admin_token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ authenticated: true, username: "admin" });
});

router.post("/admin/logout", (req, res) => {
  const token = req.cookies?.admin_token;
  if (token) sessions.delete(token);
  res.clearCookie("admin_token");
  res.json({ authenticated: false, username: null });
});

router.get("/admin/me", (req, res) => {
  const token = req.cookies?.admin_token;
  if (token && sessions.has(token)) {
    res.json({ authenticated: true, username: "admin" });
  } else {
    res.status(401).json({ authenticated: false, username: null });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [gameRow] = await db.select({ count: sql<number>`count(*)::int` }).from(gamesTable);
    const [teamRow] = await db.select({ count: sql<number>`count(*)::int` }).from(teamTable);
    const yearsActive = new Date().getFullYear() - 2022;
    const platforms = ["Mobile", "PC"];
    res.json({
      gameCount: gameRow?.count ?? 0,
      teamSize: teamRow?.count ?? 0,
      yearsActive,
      platforms,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
