import { ErrDataNotFound } from "../../../share/models/base-errors";
import { ModelStatus } from "../../../share/models/base-model";
import { DeleteCommand, IBrandRepository, ICommandHandle } from "../interface";

export class DeleteBrandCmdHandle
  implements ICommandHandle<DeleteCommand, void>
{
  constructor(private readonly repository: IBrandRepository) {}
  async execute(command: DeleteCommand) {
    const result = await this.repository.get(command.id);
    if (!result || result.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.delete(command.id, command.isHardDelete);
    return;
  }
}
