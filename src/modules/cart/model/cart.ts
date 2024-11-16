import { z } from "zod";
import { ErrQuantityMustBePositive } from "./error";

export const cartProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.array(z.string()).nullable(),
  price: z.number(),
  salePrice: z.number(),
  quantity: z.number(),
});
export type cartProductDTO = z.infer<typeof cartProductSchema>;

//Cart Item Model
export const cartItemSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1, ErrQuantityMustBePositive.message).default(1),
  product: cartProductSchema.optional(),
});
export type cartItemDTO = z.infer<typeof cartItemSchema>;
