import axios from "axios";
import {
  IBrandQueryRepository,
  ICategoryQueryRepository,
} from "../../../interface/product-interface";
import {
  ProductBrand,
  ProductBrandSchema,
  ProductCategory,
  ProductCategorySchema,
} from "../../../model/Product";

//file để lấy ra dữ liệu của 1 product thuộc 1 brand, category nào
export class RPCProductBrandRepository implements IBrandQueryRepository {
  constructor(private readonly baseUrl: string) {}
  async get(id: string): Promise<ProductBrand | null> {
    try {
      //sử dụng axios để call api lấy ra dữ liệu
      const { data } = await axios.get(`${this.baseUrl}/v1/brand/${id}`);
      const brand = ProductBrandSchema.parse(data.data);
      return brand;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
export class RPCProductCategoryRepository implements ICategoryQueryRepository {
  constructor(private readonly baseUrl: string) {}
  async get(id: string): Promise<ProductCategory | null> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/v1/categories/${id}`);
      const category = ProductCategorySchema.parse(data.data);
      return category;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
