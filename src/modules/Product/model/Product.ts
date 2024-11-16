import { z } from "zod";
import { GenderStatus, ModelStatus } from "../../../share/models/base-model";
import {
  ErrBrandIdMustBeValidUUID,
  ErrCategoryMustBeValidUUID,
  ErrNameMustBeAtLeast2Characters,
  ErrPriceMustBePositive,
  ErrQuantityMustBeNonnegative,
  ErrSalePriceMustBeNonnegative,
} from "./error";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message),
  gender: z.nativeEnum(GenderStatus),
  price: z.number().positive(ErrPriceMustBePositive),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative),
  colors: z.string().optional(),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative),
  brandId: z.string().uuid(ErrBrandIdMustBeValidUUID).optional(),
  categoryId: z.string().uuid(ErrCategoryMustBeValidUUID).optional(),
  content: z.string().optional(),
  descriptions: z.string().optional(),
  rating: z.number().min(0).max(5),
  saleCount: z.number().int().nonnegative(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
//link thêm categoryId và brandId để khi trả về 1 product hay productDetail có 2 trường n
export type Product = z.infer<typeof ProductSchema> & {
  category?: ProductCategory;
  brand?: ProductBrand;
};
// khai báo để liên kết giữa product với brand
export const ProductBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
});
export type ProductBrand = z.infer<typeof ProductBrandSchema>;
// khai báo để liên kết giữa product với category
export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
});
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
