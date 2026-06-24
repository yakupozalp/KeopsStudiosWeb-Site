import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", true);
const frontendDistDir = path.resolve(import.meta.dirname, "../../keops-studios/dist/public");
const frontendIndexHtml = path.join(frontendDistDir, "index.html");
const hasFrontendBuild = existsSync(frontendIndexHtml);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (hasFrontendBuild) {
  app.use(express.static(frontendDistDir));
}

app.use("/api", router);

if (hasFrontendBuild) {
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(frontendIndexHtml);
  });
}

export default app;
