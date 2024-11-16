import { z } from "zod";

//validate phân trang
export const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1), // số trang
  limit: z.coerce.number().int().min(1).max(100).default(10), // số dữ liệu hiển thị trên một page
  total: z.coerce.number().int().min(0).default(0).optional(), // tổng số trang
});
export type PagingDTO = z.infer<typeof PagingDTOSchema>;
