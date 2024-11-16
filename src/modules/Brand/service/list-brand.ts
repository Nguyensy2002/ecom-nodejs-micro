import { IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/models/base-errors";
import { PagingDTOSchema } from "../../../share/models/paging";
import { IBrandRepository, IQueryHandle, ListQuery } from "../interface";
import { Brand } from "../model/Brand";
import { BrandCondDTO } from "../model/dto";

export class ListBrandQuery implements IQueryHandle<ListQuery, Brand[]> {
  constructor(
    private readonly repository: IQueryRepository<Brand, BrandCondDTO>
  ) {}
  async query(query: ListQuery): Promise<Brand[]> {
    const result = await this.repository.list(query.cond, query.paging);

    return result;
  }
}
