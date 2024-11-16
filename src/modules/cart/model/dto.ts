import { z } from "zod";
import { ErrQuantityMustBePositive } from "./error";

export const addCartItemDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1, ErrQuantityMustBePositive.message).default(1),
});
export type addCartItemDTO = z.infer<typeof addCartItemDTOSchema>;
//update cart item
export const updateCartItemDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number(),
});
export type updateCartItemDTO = z.infer<typeof updateCartItemDTOSchema>;
//tìm kiếm
export const cartItemConDTOSchem = z.object({
  userId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  attribute: z.string().nullable().optional().default(""),
});
export type addCartItemCondDTO = z.infer<typeof cartItemConDTOSchem>;
