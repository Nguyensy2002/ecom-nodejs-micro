import { z } from "zod";
import { ModelStatus } from "../../../share/models/base-model";
import { ErrBrandNameTooShort } from "./error";

export const BrandCreateSchema = z.object({
  name: z.string().min(3, ErrBrandNameTooShort.message),
  image: z.string().optional(),
  tagLine: z.string().optional(),
  description: z.string().optional(),
});
export type BrandCreateDTO = z.infer<typeof BrandCreateSchema>;
//validate update
export const BrandUpdateSchema = z.object({
  name: z.string().min(3, ErrBrandNameTooShort.message).optional(),
  image: z.string().optional(),
  tagLine: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type BrandUpdateDTO = z.infer<typeof BrandUpdateSchema>;
// dto tìm kiếm theo yêu cầu
// export const BrandCondSchema = z.object({
//   name: z.string().min(3, ErrBrandNameTooShort.message).optional(),
//   tagLine: z.string().optional(),
// });
export type BrandCondDTO = {};
