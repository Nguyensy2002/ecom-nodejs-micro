//file quy định kiểu lỗi trả về
/** sự khác nhau giữa Business error/ technical error
 * business error là kiểu lỗi do business quy định từ bên ngoài
 * technical error là kiểu lỗi từ hệ thống ví dụ như kết nối db thất bại
 *
 */

export const ErrCategoryNameDuplicate = new Error(
  "Category name already exists"
);
