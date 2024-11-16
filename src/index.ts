import express, { Request, Response } from "express";
import { config } from "dotenv";
// import { setupCategoryHexagon } from "./modules/category";
import { sequelize } from "./share/component/sequelize";
import { setupBrandHexagon } from "./modules/Brand";
import { setupProduct } from "./modules/Product";
import { setupCategory } from "./modules/category";
import { setupUser } from "./modules/user";
import { TokenIntrospectRPCClient } from "./share/repository/verify-token.rpc";
import { authMiddleware } from "./share/middleware/auth";
import { allowRoles } from "./share/middleware/check-role";
import { Role } from "./modules/user/model/user";
import { setupMiddlewares } from "./share/middleware";
import { responseErr } from "./share/utils/app-error";
import { setupOrderHexagonal } from "./modules/order";

config();

(async () => {
  await sequelize.authenticate();
  console.log("connection db successfully");
  const app = express();
  const port = process.env.PORT;
  //
  const introspect = new TokenIntrospectRPCClient(
    process.env.VERIFY_TOKEN_URL || "http://localhost:3000/v1/rpc/instropect"
  );
  const authMdl = authMiddleware(introspect);
  app.get(
    "/v1/protected",
    authMdl,
    allowRoles([Role.ADMIN]),
    (req: Request, res: Response) => {
      res.status(200).json({ data: res.locals.requester });
    }
  );
  app.get("/", (req: Request, res: Response) => {
    try {
      throw new Error("error");
    } catch (error) {
      responseErr(error as Error, res);
      return;
    }
  });
  const sctx = { mdlFactory: setupMiddlewares(introspect) };

  app.use(express.json());
  app.use("/v1", setupCategory(sequelize, sctx));
  app.use("/v1", setupBrandHexagon(sequelize, sctx));
  app.use("/v1", setupProduct(sequelize, sctx));
  app.use("/v1", setupUser(sequelize, sctx));
  app.use("/v1", setupOrderHexagonal(sequelize, sctx));

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
})();
