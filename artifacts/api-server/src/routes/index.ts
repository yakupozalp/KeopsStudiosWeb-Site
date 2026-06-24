import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import teamRouter from "./team";
import siteContentRouter from "./site-content";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);
router.use(teamRouter);
router.use(siteContentRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
