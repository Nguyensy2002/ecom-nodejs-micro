import { Sequelize } from "sequelize";
import { CategoryCondDTO, CategoryUpdateDTO } from "../../model/dto";
import { Category, CategorySchema } from "../../model/model";
import { modelName } from "./dto";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "../../../../share/repository/repo-sequelize";

// implement ORM here (Sequelize)
export class MySQLCategoryRepository extends BaseRepositorySequelize<
  Category,
  CategoryCondDTO,
  CategoryUpdateDTO
> {
  constructor(sequelize: Sequelize) {
    super(
      new MySQLCategoryQueryRepository(sequelize, modelName),
      new MySQLCategoryCommandRepository(sequelize, modelName)
    );
  }
}

export class MySQLCategoryQueryRepository extends BaseQueryRepositorySequelize<
  Category,
  CategoryCondDTO
> {
  constructor(readonly sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}
export class MySQLCategoryCommandRepository extends BaseCommandRepositorySequelize<
  Category,
  CategoryUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}
