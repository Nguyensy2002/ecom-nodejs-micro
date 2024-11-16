import { Router } from "express";
import { init, modelName } from "./infras/repository/dto";
import { Sequelize } from "sequelize";
import { MySQLCategoryRepository } from "./infras/repository/repo";
import { CategoryService } from "./service";
import { CategoryHttpService } from "./infras/transport/http-service";
import { ServiceContext } from "../../share/interface/service-context";
import { Role } from "../user/model/user";

export const setupCategory = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize);
  const repository = new MySQLCategoryRepository(sequelize);
  const usecase = new CategoryService(repository);
  const httpService = new CategoryHttpService(usecase);
  const router = Router();
  //phân quyền thông qua file service-context
  const mdlFactory = sctx.mdlFactory;
  router.get("/categories", httpService.listCategoryAPI.bind(httpService));
  router.get(
    "/categories/:id",
    httpService.getDetailtCategoryAPI.bind(httpService)
  );
  router.post(
    "/categories",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.createAnewCategoryAPI.bind(httpService)
  );
  //   router.patch(
  //     "/categories/:id",
  //     httpService.updateCategoryAPI.bind(httpService)
  //   );
  //   router.delete(
  //     "/categories/:id",
  //     httpService.deleteCategoryAPI.bind(httpService)
  //   );
  return router;
};
