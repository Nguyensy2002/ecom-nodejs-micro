import { Request, Response } from "express";
import { IUserUseCase } from "../../interface";
import { PagingDTOSchema } from "../../../../share/models/paging";
import { UserCondDTOSchema } from "../../model/dto";
import { jwtProvider } from "../../../../share/component/jwt";
import { responseErr } from "../../../../share/utils/app-error";

export class UserController {
  constructor(private readonly userService: IUserUseCase) {}
  async createnewUserAPI(req: Request, res: Response) {
    try {
      const result = await this.userService.createAnewUser(req.body);
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async getDetailtUserAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.userService.getDetailtUser(id);
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async listUserAPI(req: Request, res: Response) {
    try {
      const {
        success,
        data: paging,
        error,
      } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res
          .status(400)
          .json({ message: "Invalid paging", error: error.message });
        return;
      }
      const cond = UserCondDTOSchema.parse(req.query);
      const result = await this.userService.listUser(cond, paging);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async updateUserAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.userService.updateUser(id, req.body);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async deleteUserAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.userService.deleteUser(id);
    res.status(200).json({ data: result });
  }
  //register
  async register(req: Request, res: Response) {
    await this.createnewUserAPI(req, res);
  }
  async login(req: Request, res: Response) {
    try {
      const token = await this.userService.login(req.body);
      res.status(200).json({ data: token });
    } catch (error) {
      responseErr(error as Error, res);
    }
  }
  //thong tin người dùng
  async getProfile(req: Request, res: Response) {
    try {
      //lấy token ra từ headers và cắt đi phần Bearer ở đầu chỉ lấy phần sau từ dấu cách
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }
      //verify lấy ra thông tin người dùng thông qua token
      const payload = await jwtProvider.verifyToken(token);
      if (!payload) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }
      const { sub } = payload;
      // không trả về password và salt
      const user = await this.userService.profile(sub);
      const { password, salt, ...props } = user;
      res.status(200).json({ data: props });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  //verify token
  async introspectAPI(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const result = await this.userService.verifyToken(token);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
