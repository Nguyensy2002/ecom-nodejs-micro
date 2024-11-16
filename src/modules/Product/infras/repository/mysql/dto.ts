import { DataTypes, Model, Sequelize } from "sequelize";
import {
  GenderStatus,
  ModelStatus,
} from "../../../../../share/models/base-model";

export class ProductPersistence extends Model {
  declare id: string;
  declare status: string;
}
export class CategoryPersistence extends Model {}
export class BrandPersistence extends Model {}
export const modelName = "Product";
export function init(sequelize: Sequelize) {
  ProductPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: GenderStatus.UNISEX,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "sale_price",
      },
      colors: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      brandId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "brand_id",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "category_id",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: "0",
      },
      saleCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "sale_count",
        defaultValue: "1",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "products",
    }
  );
  CategoryPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductCategory",
      createdAt: false,
      updatedAt: false,
      tableName: "categories",
    }
  );
  BrandPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductBrand",
      createdAt: false,
      updatedAt: false,
      tableName: "brands",
    }
  );
  //liên kết
  ProductPersistence.belongsTo(CategoryPersistence, {
    foreignKey: { field: "category_id" },
    as: "category",
  });
  ProductPersistence.belongsTo(BrandPersistence, {
    foreignKey: { field: "brand_id" },
    as: "brand",
  });
}
