import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/dto";
import { Router } from "express";
import { MySQLBrandRepository } from "./infras/repository/repo";
import { BrandHttpService } from "./infras/transport/http-service";
import { CreateNewBrandCmdHandle } from "./service/create-new-brand";
import { GetDetailBrandQueryHandle } from "./service/get-detail-brand";
import { UpdateBrandCmdHandle } from "./service/update-brand";
import { DeleteBrandCmdHandle } from "./service/delete-brand";
import { ListBrandQuery } from "./service/list-brand";
import { ServiceContext } from "../../share/interface/service-context";
import { Role } from "../user/model/user";

export const setupBrandHexagon = (
  sequelize: Sequelize,
  sctx: ServiceContext
) => {
  init(sequelize);
  const repository = new MySQLBrandRepository(sequelize, modelName);
  const createCmdHandle = new CreateNewBrandCmdHandle(repository);
  const getDetailQueryHandle = new GetDetailBrandQueryHandle(repository);
  const listBrandQuery = new ListBrandQuery(repository);
  const updateCmdHandle = new UpdateBrandCmdHandle(repository);
  const deleteCmdHandle = new DeleteBrandCmdHandle(repository);
  const httpService = new BrandHttpService(
    createCmdHandle,
    getDetailQueryHandle,
    listBrandQuery,
    updateCmdHandle,
    deleteCmdHandle
  );
  const mdlFactory = sctx.mdlFactory;
  const router = Router();
  router.post(
    "/brand",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.createAnewBrandAPI.bind(httpService)
  );
  router.get("/brand/:id", httpService.getDetailtBrandAPI.bind(httpService));
  router.get("/brand", httpService.listBrandAPI.bind(httpService));
  router.patch(
    "/brand/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.updateBrandAPI.bind(httpService)
  );
  router.delete(
    "/brand/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.deletedBrandAPI.bind(httpService)
  );
  return router;
};
