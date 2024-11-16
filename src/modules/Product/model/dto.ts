import { z } from "zod";
import { GenderStatus, ModelStatus } from "../../../share/models/base-model";
import {
  ErrBrandIdMustBeValidUUID,
  ErrCategoryMustBeValidUUID,
  ErrFromPriceMustBePositive,
  ErrNameMustBeAtLeast2Characters,
  ErrPriceMustBePositive,
  ErrQuantityMustBeNonnegative,
  ErrSalePriceMustBeNonnegative,
  ErrToPriceMustBePositive,
} from "./error";

export const createProductSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message),
  price: z.number().positive(ErrPriceMustBePositive),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative),
  brandId: z.string().uuid(ErrBrandIdMustBeValidUUID).optional(),
  categoryId: z.string().uuid(ErrCategoryMustBeValidUUID).optional(),
  content: z.string().optional(),
  descriptions: z.string().optional(),
});
export type ProductCreateDTO = z.infer<typeof createProductSchema>;
export const updateProductSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message),
  price: z.number().positive(ErrPriceMustBePositive),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative),
  brandId: z.string().uuid(ErrBrandIdMustBeValidUUID).optional(),
  categoryId: z.string().uuid(ErrCategoryMustBeValidUUID).optional(),
  content: z.string().optional(),
  descriptions: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type ProductUpdateDTO = z.infer<typeof createProductSchema>;
export const ProductCondSchema = z.object({
  fromPrice: z.number().positive(ErrFromPriceMustBePositive).optional(),
  toPrice: z.number().positive(ErrToPriceMustBePositive).optional(),
  brandId: z.string().uuid(ErrBrandIdMustBeValidUUID).optional(),
  categoryId: z.string().uuid(ErrCategoryMustBeValidUUID).optional(),
});
export type ProductCondDTO = z.infer<typeof ProductCondSchema>;
