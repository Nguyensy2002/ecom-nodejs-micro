import { Request, Response } from "express";
import {
  CreateCommand,
  DeleteCommand,
  GetDetailQuery,
  ICommandHandle,
  IQueryHandle,
  ListQuery,
  UpdateCommand,
} from "../../interface";

import { PagingDTOSchema } from "../../../../share/models/paging";
import { Brand } from "../../model/Brand";

export class BrandHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandle<CreateCommand, string>,
    private readonly getDetailQueryHandle: IQueryHandle<GetDetailQuery, Brand>,
    private readonly listQueryHandle: IQueryHandle<ListQuery, Brand[]>,
    private readonly updateCmdHandle: ICommandHandle<UpdateCommand, void>,
    private readonly deleteCmdHandle: ICommandHandle<DeleteCommand, void>
  ) {}
  async createAnewBrandAPI(req: Request, res: Response) {
    try {
      const cmd: CreateCommand = { data: req.body };
      // const result = await this.service.createAnewBrand(req.body);
      const result = await this.createCmdHandler.execute(cmd);
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
  async getDetailtBrandAPI(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await this.getDetailQueryHandle.query({ id });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async listBrandAPI(req: Request, res: Response) {
    const {
      success,
      data: paging,
      error,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({
        message: "Invalid paging",
        error: error.message,
      });
      return;
    }
    const result = await this.listQueryHandle.query({ cond: {}, paging });
    res.status(200).json({ data: result, paging: paging, filter: {} });
  }

  async updateBrandAPI(req: Request, res: Response) {
    const { id } = req.params;
    const cmd: UpdateCommand = { id, data: req.body };
    await this.updateCmdHandle.execute(cmd);
    res.status(200).json({ data: true });
  }
  async deletedBrandAPI(req: Request, res: Response) {
    const { id } = req.params;
    // const cmd: DeleteCommand = { id, isHardDelete: false };
    try {
      await this.deleteCmdHandle.execute({ id, isHardDelete: false });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
