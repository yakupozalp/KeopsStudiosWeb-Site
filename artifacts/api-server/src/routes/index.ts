import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import teamRouter from "./team";
import siteContentRouter from "./site-content";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);
router.use(teamRouter);
router.use(siteContentRouter);
router.use(adminRouter);

export default router;
