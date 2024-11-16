import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/paging";
import {
  CategoryCondDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../model/dto";
import { Category } from "../model/model";
export interface ICategoryRepository
  extends IRepository<Category, CategoryUpdateDTO, CategoryCondDTO> {}
export interface ICategoryUseCase {
  createAnewCategory(data: CategoryCreateDTO): Promise<string>;
  getDetailtCategory(id: string): Promise<Category | null>;
  listCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Array<Category>>;
  updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}
// //interface comand: insert, update, delete
// export interface ICommandHandle<Cmd, Result> {
//   execute(command: Cmd): Promise<Result>;
// }
// //interface comand: insert, update, delete
// export interface CreateCommand {
//   data: CategoryCreateDTO;
// }
// //interface update
// export interface UpdateCommand {
//   id: string;
//   data: CategoryUpdateDTO;
// }
// // interface delete
// export interface DeleteCommand {
//   id: string;
//   isHardDelete: boolean;
// }

// //interface dùng để query dữ liệu: get, get(list)
// export interface IQueryHandle<Query, Result> {
//   query(query: Query): Promise<Result>;
// }
// //interface để query dữ liệu
// export interface GetDetailQuery {
//   id: string;
// }
// //interface list dữ liệu
// export interface ListQuery {
//   cond: CategoryCondDTO;
//   paging: PagingDTO;
// }
// export interface ICategoryRepository
//   extends IRepository<Category, CategoryUpdateDTO, CategoryCondDTO> {}

// //dùng để query api
// // export interface IQueryRepository {
// //   get(id: string): Promise<Category | null>;
// //   list(cond: CategoryCondDTO, paging: PagingDTO): Promise<Array<Category>>;
// // }
// // //dùng để thêm sửa xóa
// // export interface ICommandRepository {
// //   insert(data: Category): Promise<boolean>;

// //   update(id: string, data: CategoryUpdateDTO): Promise<boolean>;
// //   delete(id: string, isHard: boolean): Promise<boolean>;
// // }
