import { Sequelize } from "sequelize";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "../../../../../share/repository/repo-sequelize";
import { UserCondDTO, UserUpdateDTO } from "../../../model/dto";
import { User } from "../../../model/user";

export class MySQLUserRepository extends BaseRepositorySequelize<
  User,
  UserCondDTO,
  UserUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MySQLUserQueryRepository(sequelize, modelName),
      new MySQLUserCommandRepository(sequelize, modelName)
    );
  }
}
export class MySQLUserCommandRepository extends BaseCommandRepositorySequelize<
  User,
  UserUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
export class MySQLUserQueryRepository extends BaseQueryRepositorySequelize<
  User,
  UserCondDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
