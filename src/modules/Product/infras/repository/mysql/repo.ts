import { Sequelize } from "sequelize";
import { Product } from "../../../model/Product";
import { ProductCondDTO, ProductUpdateDTO } from "../../../model/dto";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "../../../../../share/repository/repo-sequelize";

export class MySQLProductRepository extends BaseRepositorySequelize<
  Product,
  ProductCondDTO,
  ProductUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLProductQueryRepository(sequelize, modelName),
      new MYSQLProductCommandRepository(sequelize, modelName)
    );
  }
}
export class MYSQLProductQueryRepository extends BaseQueryRepositorySequelize<
  Product,
  ProductCondDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
  // async get(id: string): Promise<Product | null> {
  //   //lấy ra data và hiển thị data thuộc link category_id nào
  //   const data = await this.sequelize.models[this.modelName].findByPk(id, {
  //     include: [
  //       { model: this.sequelize.models["ProductCategory"], as: "category" },
  //       { model: this.sequelize.models["ProductBrand"], as: "brand" },
  //     ],
  //   });
  //   if (!data) {
  //     return null;
  //   }
  //   const persistenceData = data.get({ plain: true });
  //   //xóa trường created_at và updated_at để k hiển thị ra
  //   const { created_at, updated_at, ...props } = persistenceData;
  //   return {
  //     ...props,
  //     createdAt: persistenceData.created_at,
  //     updatedAt: persistenceData.updated_at,
  //   } as Product;
  // }
}
export class MYSQLProductCommandRepository extends BaseCommandRepositorySequelize<
  Product,
  ProductUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
