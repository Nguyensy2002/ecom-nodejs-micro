export const ErrNameMustBeAtLeast2Characters = new Error(
  "Name must be at least 2 characters"
);
export const ErrPriceMustBePositive = new Error("Price must be positive");
export const ErrSalePriceMustBeNonnegative = new Error(
  "Sale price must be nonnegative"
);
export const ErrQuantityMustBeNonnegative = new Error(
  "Quantity must be nonnegative"
);
export const ErrBrandIdMustBeValidUUID = new Error(
  "Brand Id must be a valid UUID"
);
export const ErrCategoryMustBeValidUUID = new Error(
  "Category must be a valid UUID"
);
export const ErrFromPriceMustBePositive = new Error(
  "From Price must be positive"
);
export const ErrToPriceMustBePositive = new Error("To Price must be positive");
export const ErrBrandNotFound = new Error("brand data not found");
export const ErrCategoryNotFound = new Error("Category data not found");
