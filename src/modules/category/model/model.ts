import { z } from "zod";
import { ModelStatus } from "../../../share/models/base-model";

//business object/model/entity
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "name must be at least 3 characters"),
  image: z.string().optional(),
  descriptions: z.string().optional(),
  position: z.number().min(0, "invalid position").default(0).optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Category = z.infer<typeof CategorySchema> & {
  children?: Category[];
};
