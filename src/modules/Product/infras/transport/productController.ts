import { Request, Response } from "express";
import {
  IBrandQueryRepository,
  ICategoryQueryRepository,
  IProductUseCase,
} from "../../interface/product-interface";
import { PagingDTOSchema } from "../../../../share/models/paging";
import { ProductCondDTO, ProductCondSchema } from "../../model/dto";
import { IQueryRepository } from "../../../../share/interface";
import { Product } from "../../model/Product";

export class ProductController {
  constructor(
    private readonly service: IProductUseCase,
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository,
    private readonly prodQueryRepo: IQueryRepository<Product, ProductCondDTO>
  ) {}
  async createnewProductAPI(req: Request, res: Response) {
    try {
      const result = await this.service.createAnewProduct(req.body);
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async getDetailtProductAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getDetailtProduct(id);
      //hiển thị ra dữ liệu của product thuộc brandId nào
      const brand = await this.productBrandRepository.get(result!.brandId!);
      if (brand) {
        result!.brand = brand!;
      }
      //hiển thị ra dữ liệu của product thuộc categoryId nào
      const category = await this.productCategoryRepository.get(
        result!.categoryId!
      );
      if (category) {
        result!.category = category!;
      }
      res.status(200).send({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async listProductAPI(req: Request, res: Response) {
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
      const cond = ProductCondSchema.parse(req.query);
      const result = await this.service.listProduct(cond, paging);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async updateProductAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.updateProduct(id, req.body);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async deleteProductAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.service.deleteProduct(id);
    res.status(200).json({ data: result });
  }
  // lấy ra danh sách mảng id
  async listProductByIdsAPI(req: Request, res: Response) {
    const { ids } = req.body;
    const result = await this.prodQueryRepo.listByIds(ids);
    res.status(200).json({ data: result });
  }
}
