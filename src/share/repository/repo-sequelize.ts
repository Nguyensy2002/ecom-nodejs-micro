import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import {
  ICommandRepository,
  IQueryRepository,
  IRepository,
} from "../interface";
import { PagingDTO } from "../models/paging";
import { ModelStatus } from "../models/base-model";

export abstract class BaseRepositorySequelize<Entity, UpdateDTO, Cond>
  implements IRepository<Entity, UpdateDTO, Cond>
{
  constructor(
    readonly queryRepo: IQueryRepository<Entity, Cond>,
    readonly cmdRepo: ICommandRepository<Entity, UpdateDTO>
  ) {}
  async get(id: string): Promise<Entity | null> {
    return await this.queryRepo.get(id);
  }
  async findByCond(cond: Cond): Promise<Entity | null> {
    return await this.queryRepo.findByCond(cond);
  }
  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    return await this.queryRepo.list(cond, paging);
  }
  async listByIds(ids: string[]): Promise<Array<Entity>> {
    return await this.queryRepo.listByIds(ids);
  }
  async insert(data: Entity): Promise<boolean> {
    return await this.cmdRepo.insert(data);
  }
  async update(id: string, data: UpdateDTO): Promise<boolean> {
    return await this.cmdRepo.update(id, data);
  }
  async delete(id: string, isHard: boolean): Promise<boolean> {
    return await this.cmdRepo.delete(id, isHard);
  }
}
//command
export class BaseCommandRepositorySequelize<Entity, UpdateDTO>
  implements ICommandRepository<Entity, UpdateDTO>
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
  async insert(data: Entity): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }
  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id },
    });
    return true;
  }
  async delete(id: string, isHard: boolean): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update(
        {
          status: ModelStatus.DELETED,
        },
        { where: { id } }
      );
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }
    return true;
  }
}
//query
export class BaseQueryRepositorySequelize<Entity, Cond>
  implements IQueryRepository<Entity, Cond>
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
  //lấy ra danh sách id
  async listByIds(ids: string[]): Promise<Array<Entity>> {
    const row = await this.sequelize.models[this.modelName].findAll({
      where: { id: { [Op.in]: ids } },
    });
    return row.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;
      return {
        ...props,
        created_at: persistenceData.createdAt,
        updated_at: persistenceData.updatedAt,
      } as Entity;
    });
  }
  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) {
      return null;
    }
    const persistenceData = data.get({ plain: true });
    return {
      ...persistenceData,
      chilrent: [],
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity;
  }
  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: cond as any,
    });
    if (!data) {
      return null;
    }
    const persistenceData = data.get({ plain: true });
    return persistenceData as Entity;
  }
  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    const { limit, page } = paging;
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };
    const total = await this.sequelize.models[this.modelName].count({
      where: condSQL,
    });
    paging.total = total;
    const row = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [["id", "DESC"]],
    });
    return row.map((row) => row.get({ plain: true }));
  }
}
