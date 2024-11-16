import { v7 } from "uuid";
import { ModelStatus } from "../../../share/models/base-model";
import { ICategoryUseCase } from "../interface";
import {
  CategoryCondDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../model/dto";
import { Category } from "../model/model";
import { PagingDTO } from "../../../share/models/paging";
import { ErrDataNotFound } from "../../../share/models/base-errors";
import { IRepository } from "../../../share/interface";

export class CategoryService implements ICategoryUseCase {
  constructor(
    private readonly repository: IRepository<
      Category,
      CategoryCondDTO,
      CategoryUpdateDTO
    >
  ) {}
  async createAnewCategory(data: CategoryCreateDTO): Promise<string> {
    const newId = v7();
    const category: Category = {
      id: newId,
      name: data.name,
      position: 0,
      descriptions: data.description,
      image: data.image,
      // parentId: data.parentId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(category);
    return newId;
  }
  //get category by id
  async getDetailtCategory(id: string): Promise<Category | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return data;
  }
  // get list category
  async listCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Array<Category>> {
    const data = await this.repository.list(cond, paging);
    return data;
  }
  // update category by id
  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const result = await this.repository.get(id);
    if (!result || result.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    const newCategory = await this.repository.update(id, data);
    return newCategory;
  }
  //delete category by id
  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.repository.get(id);
    if (!result || result.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return await this.repository.delete(id, false);
  }
}
