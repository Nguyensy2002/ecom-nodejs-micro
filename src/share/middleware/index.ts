import { ITokenIntrospect } from "../../modules/user/interface";
import { MdlFactory } from "../interface/service-context";
import { authMiddleware } from "./auth";
import { allowRoles } from "./check-role";

export const setupMiddlewares = (introspect: ITokenIntrospect): MdlFactory => {
  const auth = authMiddleware(introspect);
  return {
    auth,
    allowRoles,
  };
};
