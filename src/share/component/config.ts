import dotenv from "dotenv";

dotenv.config();

export const config = {
  rpc: {
    productBrand: process.env.RPC_PRODUCT_BRAND_URL || "http://localhost:3000",
    productCategory:
      process.env.RPC_PRODUCT_CATEGORY || "http://localhost:3000",
    product: process.env.RPC_PRODUCT_URL || "http://localhost:3000",
    cart: process.env.RPC_CART_URL || "http://localhost:3000",
  },
  accessToken: {
    secretKey: process.env.JWT_SECRET_KEY || "synguyenquoc",
    expiresIn: "7d",
  },
};
