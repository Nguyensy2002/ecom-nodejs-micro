import { Handler, NextFunction, Request, Response } from "express";
import { Role } from "../../modules/user/model/user";
import { error } from "console";
import { Requester } from "../../modules/user/interface";

//file check role hay còn gọi là phân quyền
export function allowRoles(role: Role[]): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.requester) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }
    const requester = res.locals.requester as Requester;
    if (role.indexOf(requester.role) === -1) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }
    next;
  };
}
