import { z } from "zod";
import { ModelStatus } from "../../../share/models/base-model";

//create dto
export const CategoryCreateSchema = z.object({
  name: z.string().min(2, "name must be at least 3 characters"),
  image: z.string().optional(),
  position: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
});
export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;
//update dto
export const CategoryUpdateSchema = z.object({
  name: z.string().min(2, "name must be at least 3 characters").optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;
//điều kiện tìm kiếm
export const CategoryCondDTOSchema = z.object({
  name: z.string().min(2, "name must be at least 3 characters").optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type CategoryCondDTO = z.infer<typeof CategoryCondDTOSchema>;
