import { z } from "zod";
import { ModelStatus } from "../../../share/models/base-model";
import { ErrBrandNameTooShort } from "./error";

export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, ErrBrandNameTooShort.message),
  image: z.string().optional(),
  tagLine: z.string().optional(),
  descriptions: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Brand = z.infer<typeof BrandSchema>;
