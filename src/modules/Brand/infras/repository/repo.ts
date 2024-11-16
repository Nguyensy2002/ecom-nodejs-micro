import { Sequelize } from "sequelize";

import { modelName } from "./dto";
import { Brand } from "../../model/Brand";
import { BrandCondDTO, BrandUpdateDTO } from "../../model/dto";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "../../../../share/repository/repo-sequelize";

// export class MySQLBrandRepository extends BaseRepositorySequelize<
//   Brand,
//   BrandCondDTO,
//   BrandUpdateDTO
// > {
//   constructor(readonly sequelize: Sequelize, readonly modelName: string) {
//     super(sequelize, modelName);
//   }

// }
export class MySQLBrandRepository extends BaseRepositorySequelize<
  Brand,
  BrandCondDTO,
  BrandUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLBrandQueryRepository(sequelize, modelName),
      new MYSQLBrandCommandRepository(sequelize, modelName)
    );
  }
}
export class MYSQLBrandQueryRepository extends BaseQueryRepositorySequelize<
  Brand,
  BrandCondDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
export class MYSQLBrandCommandRepository extends BaseCommandRepositorySequelize<
  Brand,
  BrandUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
