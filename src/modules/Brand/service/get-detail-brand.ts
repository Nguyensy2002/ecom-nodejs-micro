import { ErrDataNotFound } from "../../../share/models/base-errors";
import { GetDetailQuery, IBrandRepository, IQueryHandle } from "../interface";
import { Brand } from "../model/Brand";

export class GetDetailBrandQueryHandle
  implements IQueryHandle<GetDetailQuery, Brand>
{
  constructor(private readonly repository: IBrandRepository) {}
  async query(query: GetDetailQuery): Promise<Brand> {
    const data = await this.repository.get(query.id);
    if (!data) {
      throw ErrDataNotFound;
    }
    return data;
  }
}
