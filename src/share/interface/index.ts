import { PagingDTO } from "../models/paging";

export interface IRepository<Entity, UpdateDt, Cond>
  extends IQueryRepository<Entity, Cond>,
    ICommandRepository<Entity, UpdateDt> {}
//dùng để query api
export interface IQueryRepository<Entity, Cond> {
  get(id: string): Promise<Entity | null>;
  list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>>;
  findByCond(cond: Cond): Promise<Entity | null>;
  listByIds(ids: string[]): Promise<Array<Entity>>;
}
//dùng để thêm sửa xóa
export interface ICommandRepository<Entity, UpdateDt> {
  insert(data: Entity): Promise<boolean>;

  update(id: string, data: UpdateDt): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}
