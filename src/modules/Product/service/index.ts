import { v7 } from "uuid";
import { IQueryRepository, IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/paging";
import {
  IBrandQueryRepository,
  ICategoryQueryRepository,
  IProductUseCase,
} from "../interface/product-interface";
import {
  createProductSchema,
  ProductCondDTO,
  ProductCondSchema,
  ProductCreateDTO,
  ProductUpdateDTO,
  updateProductSchema,
} from "../model/dto";
import { Product } from "../model/Product";
import { GenderStatus, ModelStatus } from "../../../share/models/base-model";
import { ErrDataNotFound } from "../../../share/models/base-errors";
import { ErrBrandNotFound, ErrCategoryNotFound } from "../model/error";

export class ProductService implements IProductUseCase {
  constructor(
    private readonly repository: IRepository<
      Product,
      ProductUpdateDTO,
      ProductCondDTO
    >,
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository
  ) {}

  async createAnewProduct(data: ProductCreateDTO): Promise<string> {
    const dto = createProductSchema.parse(data);
    //check brandId
    if (dto.brandId) {
      const brand = await this.productBrandRepository.get(dto.brandId);
      if (!brand) {
        throw ErrBrandNotFound;
      }
    }
    //check categoryId
    if (dto.categoryId) {
      const category = await this.productCategoryRepository.get(dto.categoryId);
      if (!category) {
        throw ErrCategoryNotFound;
      }
    }
    const newId = v7();
    const newProduct: Product = {
      ...dto,
      id: newId,
      status: ModelStatus.ACTIVE,
      rating: 0,
      saleCount: 0,
      gender: GenderStatus.UNISEX,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(newProduct);
    return newId;
  }
  async getDetailtProduct(id: string): Promise<Product | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return data;
  }
  async listProduct(
    cond: ProductCondDTO,
    paging: PagingDTO
  ): Promise<Array<Product>> {
    const parsedCound = ProductCondSchema.parse(cond);
    const result = await this.repository.list(parsedCound, paging);
    return result;
  }
  async updateProduct(id: string, data: ProductUpdateDTO): Promise<boolean> {
    const dto = updateProductSchema.parse(data);
    const product = await this.repository.get(id);
    if (!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.update(id, dto);
    return true;
  }
  async deleteProduct(id: string): Promise<boolean> {
    const data = await this.repository.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.delete(id, false);
    return true;
  }
}
