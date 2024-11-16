import { Request, Response } from "express";
import { IOrderUseCase } from "../../interface";
import { Requester } from "../../../user/interface";

export class OrderHttpService {
  constructor(private readonly orderUseCase: IOrderUseCase) {}
  async makeOrderAPI(req: Request, res: Response) {
    const { body } = req;
    const requester = res.locals.requester as Requester;
    const result = await this.orderUseCase.makeOrder(requester, body);
    res.status(200).json({ data: result });
  }
}
