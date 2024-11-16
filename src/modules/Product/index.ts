import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/mysql/dto";
import { MySQLProductRepository } from "./infras/repository/mysql/repo";
import { ProductService } from "./service";
import { ProductController } from "./infras/transport/productController";
import { Router } from "express";
import {
  RPCProductBrandRepository,
  RPCProductCategoryRepository,
} from "./infras/repository/rpc-repo";
import { config } from "../../share/component/config";
import { ServiceContext } from "../../share/interface/service-context";
import { Role } from "../user/model/user";

export const setupProduct = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize);
  const repository = new MySQLProductRepository(sequelize, modelName);

  //để lấy ra các sản phẩm thuộc brandId
  const productBrandRepository = new RPCProductBrandRepository(
    config.rpc.productBrand
  );
  //để lấy ra các sản phẩm thuộc categoryId
  const productCategoryRepository = new RPCProductCategoryRepository(
    config.rpc.productCategory
  );
  const usecase = new ProductService(
    repository,
    productBrandRepository,
    productCategoryRepository
  );
  const httpService = new ProductController(
    usecase,
    productBrandRepository,
    productCategoryRepository,
    repository
  );
  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  router.post(
    "/products",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.createnewProductAPI.bind(httpService)
  );
  router.get(
    "/products/:id",
    httpService.getDetailtProductAPI.bind(httpService)
  );
  router.get("/products", httpService.listProductAPI.bind(httpService));
  router.patch(
    "/products/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.updateProductAPI.bind(httpService)
  );
  router.delete(
    "/products/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.deleteProductAPI.bind(httpService)
  );
  //rpc
  router.post(
    "/rpc/products/by-ids",
    httpService.listProductByIdsAPI.bind(httpService)
  );
  return router;
};
