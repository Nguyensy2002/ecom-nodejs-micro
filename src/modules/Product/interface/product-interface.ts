import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/paging";
import {
  ProductCondDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
} from "../model/dto";
import { Product, ProductBrand, ProductCategory } from "../model/Product";
//confid hexagonal
// export interface ICommandHandle<Cmd, Result> {
//   execute(command: Cmd): Promise<Result>;
// }
// export interface CreateProduct {
//   data: ProductCreateDTO;
// }
// export interface UpdateProduct {
//   id: string;
//   data: ProductUpdateDTO;
// }
// export interface DeleteProduct {
//   id: string;
// }
// //query
// export interface IQueryHandle<Query, Result> {
//   query(query: Query): Promise<Result>;
// }
// export interface GetDetaiQuery {
//   id: string;
// }
// export interface ListQuery {
//   cond: ProductCondDTO;
//   paging: PagingDTO;
// }
// //
export interface IProductRepository
  extends IRepository<Product, ProductUpdateDTO, ProductCondDTO> {}
export interface IProductUseCase {
  createAnewProduct(data: ProductCreateDTO): Promise<string>;
  getDetailtProduct(id: string): Promise<Product | null>;
  listProduct(cond: ProductCondDTO, paging: PagingDTO): Promise<Array<Product>>;
  updateProduct(id: string, data: ProductUpdateDTO): Promise<boolean>;
  deleteProduct(id: string): Promise<boolean>;
}
//interface brand để link qua product
export interface IBrandQueryRepository {
  get(id: string): Promise<ProductBrand | null>;
}
//interface brand để link qua product
export interface ICategoryQueryRepository {
  get(id: string): Promise<ProductCategory | null>;
}
