import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/mysql/dto";
import { MySQLUserRepository } from "./infras/repository/mysql/repo";
import { UserService } from "./service";
import { UserController } from "./infras/transport/userController";
import { Router } from "express";
import { ServiceContext } from "../../share/interface/service-context";
import { Role } from "./model/user";

export const setupUser = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize);
  const repository = new MySQLUserRepository(sequelize, modelName);
  const usecase = new UserService(repository);
  const httpService = new UserController(usecase);
  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  //auth
  router.post("/register", httpService.register.bind(httpService));
  router.post("/login", httpService.login.bind(httpService));
  //get profile by user
  router.get("/profile", httpService.getProfile.bind(httpService));
  //crud
  router.post(
    "/users",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.createnewUserAPI.bind(httpService)
  );
  router.get("/users/:id", httpService.getDetailtUserAPI.bind(httpService));
  router.get("/users", httpService.listUserAPI.bind(httpService));
  router.patch(
    "/users/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.updateUserAPI.bind(httpService)
  );
  router.delete(
    "/users/:id",
    mdlFactory.auth,
    mdlFactory.allowRoles([Role.ADMIN]),
    httpService.deleteUserAPI.bind(httpService)
  );
  //
  router.post("/rpc/instropect", httpService.introspectAPI.bind(httpService));

  return router;
};
