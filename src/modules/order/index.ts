import { Sequelize } from "sequelize";
import { ServiceContext } from "../../share/interface/service-context";
import { Router } from "express";
import { init, modelName } from "./infras/repository/mysql";
import { OrderCommandRepository } from "./infras/repository/mysql/repo";
import { CartQueryRepository } from "./infras/repository/rpc";
import { config } from "../../share/component/config";
import { OrderUseCase } from "./usecase";
import { OrderHttpService } from "./infras/tranport/http-service";

export function setupOrderHexagonal(
  sequelize: Sequelize,
  sctx: ServiceContext
) {
  init(sequelize);
  const orderCommandRepository = new OrderCommandRepository(
    sequelize,
    modelName
  );
  const cartQueryRepository = new CartQueryRepository(config.rpc.cart);
  const orderUseCase = new OrderUseCase(
    orderCommandRepository,
    cartQueryRepository
  );
  const orderHttpService = new OrderHttpService(orderUseCase);
  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  router.post(
    "/orders",
    mdlFactory.auth,
    orderHttpService.makeOrderAPI.bind(orderHttpService)
  );
  return router;
}
