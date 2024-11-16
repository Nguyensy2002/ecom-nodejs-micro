import { IRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/models/base-errors";
import { ModelStatus } from "../../../share/models/base-model";
import { IBrandRepository, ICommandHandle, UpdateCommand } from "../interface";
import { BrandUpdateSchema } from "../model/dto";

export class UpdateBrandCmdHandle
  implements ICommandHandle<UpdateCommand, void>
{
  constructor(private readonly repository: IBrandRepository) {}
  async execute(command: UpdateCommand): Promise<void> {
    const { success, data, error } = BrandUpdateSchema.safeParse(command.data);
    if (!success) {
      throw new Error("Invalid data");
    }
    const result = await this.repository.get(command.id);
    if (!result || result.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.update(command.id, data);
    return;
  }
}
