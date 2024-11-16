import { v7 } from "uuid";
import { CreateCommand, IBrandRepository, ICommandHandle } from "../interface";
import { BrandCreateSchema } from "../model/dto";
import { ErrBrandNameDuplicate } from "../model/error";
import { Brand } from "../model/Brand";
import { ModelStatus } from "../../../share/models/base-model";

export class CreateNewBrandCmdHandle
  implements ICommandHandle<CreateCommand, string>
{
  constructor(private readonly repository: IBrandRepository) {}
  async execute(command: CreateCommand): Promise<string> {
    const {
      success,
      data: parsedData,
      error,
    } = BrandCreateSchema.safeParse(command.data);
    if (!success) {
      throw new Error("Invalid data");
    }
    //tìm kiếm tên đã tồn tại hay chưa
    const checkNameBrand = await this.repository.findByCond({
      name: parsedData.name,
    });
    if (checkNameBrand) {
      throw ErrBrandNameDuplicate;
    }

    const newId = v7();
    const newBand: Brand = {
      ...parsedData,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(newBand);
    return newId;
  }
}
