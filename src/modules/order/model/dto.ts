import { z } from "zod";
import { OrderStatus, PaymentMethod, PaymentStatus, ShippingMethod } from ".";

export const orderCreateSchema = z.object({
  shippingAddress: z.string().min(5),
  shippingCity: z.string().optional(),
  recipientFirstName: z.string(),
  recipientLastName: z.string(),
  recipentPhone: z.string().optional(),
  recipentEmail: z.string().optional(),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
});
export type OrderCreateDTO = z.infer<typeof orderCreateSchema>;
export const orderUpdateSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().optional(),
  recipientFirstName: z.string(),
  recipientLastName: z.string(),
  recipentPhone: z.string().optional(),
  recipentEmail: z.string().optional(),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  status: z.nativeEnum(OrderStatus),
});
export type OrderUpdateDTO = z.infer<typeof orderUpdateSchema>;
export const orderCondSchema = z.object({
  userId: z.string().uuid().optional(),
  shippingMethod: z.nativeEnum(ShippingMethod).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  trackingNumber: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});
export type OrderCondDTO = z.infer<typeof orderCondSchema>;
