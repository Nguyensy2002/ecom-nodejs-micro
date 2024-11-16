import { PagingDTO } from "../../../share/models/paging";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto";
import { Brand } from "../model/Brand";
import { IRepository } from "../../../share/interface";

// export interface IBrandUseCase {
//   createAnewBrand(data: BrandCreateDTO): Promise<string>;
//   getDetailtBrand(id: string): Promise<Brand | null>;
//   listBrands(paging: PagingDTO, cond: BrandCondDTO): Promise<Array<Brand>>;
//   updateBrand(id: string, data: BrandUpdateDTO): Promise<boolean>;
//   deleteBrand(id: string): Promise<boolean>;
// }

//interface comand: insert, update, delete
export interface ICommandHandle<Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}
//interface comand: insert, update, delete
export interface CreateCommand {
  data: BrandCreateDTO;
}
//interface update
export interface UpdateCommand {
  id: string;
  data: BrandUpdateDTO;
}
// interface delete
export interface DeleteCommand {
  id: string;
  isHardDelete: boolean;
}

//interface dùng để query dữ liệu: get, get(list)
export interface IQueryHandle<Query, Result> {
  query(query: Query): Promise<Result>;
}
//interface để query dữ liệu
export interface GetDetailQuery {
  id: string;
}
//interface list dữ liệu
export interface ListQuery {
  cond: BrandCondDTO;
  paging: PagingDTO;
}
//
export interface IBrandRepository
  extends IRepository<Brand, BrandUpdateDTO, BrandCondDTO> {}
// //dùng để query api
// export interface IQueryRepository {
//   get(id: string): Promise<Brand | null>;
//   list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>>;
// }
// //dùng để thêm sửa xóa
// export interface ICommandRepository {
//   insert(data: Brand): Promise<boolean>;

//   update(id: string, data: BrandUpdateDTO): Promise<boolean>;
//   delete(id: string, isHard: boolean): Promise<boolean>;
// }
