import { Sequelize, where } from "sequelize";

import { cartItemDTO } from "../../../model/cart";
import { addCartItemCondDTO, updateCartItemDTO } from "../../../model/dto";
import {
  ICartCommandRepository,
  ICartQueryRepository,
} from "../../../interface";

export class MySQLCartRepository
  implements ICartQueryRepository, ICartCommandRepository
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}

  async get(id: string): Promise<cartItemDTO | null> {
    const item = await this.sequelize.models[this.modelName].findByPk(id);
    return item ? (item.get({ plain: true }) as cartItemDTO) : null;
  }

  async insert(data: cartItemDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async update(id: string, data: cartItemDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, {
      where: { id },
    });
    return true;
  }
  async updateMany(
    dtos: updateCartItemDTO[],
    userId: string
  ): Promise<boolean> {
    await this.sequelize.transaction(async (t) => {
      for (let i = 0; i < dtos.length; i++) {
        const { attribute, productId, quantity } = dtos[i];
        await this.sequelize.models[this.modelName].update(
          { quantity },
          { where: { productId, attribute, userId } }
        );
      }
      return true;
    });
    return true;
  }
  async remove(id: string, isHash: boolean): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
  async listItems(userId: string): Promise<Array<cartItemDTO>> {
    const items = await this.sequelize.models[this.modelName].findAll({
      where: { userId },
    });
    return items.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;
      return {
        ...props,
        createdAt: persistenceData.created_at,
        updatedAt: persistenceData.updated_at,
      };
    });
  }
  async findByCond(
    cond: addCartItemCondDTO
  ): Promise<Array<cartItemDTO> | null> {
    const item = await this.sequelize.models[this.modelName].findOne({
      where: cond,
    });
    if (!item) {
      return null;
    }
    const persistenceData = item.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;
    return {
      ...props,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    };
  }
}
