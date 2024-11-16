import { Handler } from "express";
import { Role } from "../../modules/user/model/user";

export interface MdlFactory {
  auth: Handler;
  allowRoles: (roles: Role[]) => Handler;
}

export type ServiceContext = {
  mdlFactory: MdlFactory;
};
