import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/mysql/dto";
import { MySQLCartRepository } from "./infras/repository/mysql";
import { CartService } from "./usecase";
import { ServiceContext } from "../../share/interface/service-context";
import { Router } from "express";
import { CartProductRPCRepo } from "./infras/repository/rpc";
import { config } from "../../share/component/config";
import { CartController } from "./infras/transport/CartController";

export function setupCartHexagon(
  sequelize: Sequelize,
  sctx: ServiceContext
): Router {
  init(sequelize);
  const cartRepository = new MySQLCartRepository(sequelize, modelName);
  const productRPCRepository = new CartProductRPCRepo(config.rpc.product);
  const usecase = new CartService(
    cartRepository,
    cartRepository,
    productRPCRepository
  );
  const httpService = new CartController(
    usecase,
    cartRepository,
    productRPCRepository
  );

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  router.get(
    "/carts",
    mdlFactory.auth,
    httpService.listItemsAPI.bind(httpService)
  );
  router.post(
    "/carts",
    mdlFactory.auth,
    httpService.addProductToCartAPI.bind(httpService)
  );
  router.patch(
    "/carts",
    mdlFactory.auth,
    httpService.updateProductQuantitiesAPI.bind(httpService)
  );
  router.delete(
    "/carts/:id",
    mdlFactory.auth,
    httpService.removeProductFromCartAPI.bind(httpService)
  );
  //RPC
  router.post("rpc/carts/items", httpService.listItemsRPC.bind(httpService));
  return router;
}
