import { IProductQueryRepository } from "../../../interface";
import { cartProductDTO } from "../../../model/cart";
import axios from "axios";

//file call dữ liệu sang product
export class CartProductRPCRepo implements IProductQueryRepository {
  constructor(private readonly baseUrl: string) {}
  //call api lấy dữ liệu từ db productId để dùng cho cart
  async findById(id: string): Promise<cartProductDTO | null> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/v1/products/${id}`);
      //convert product model -> cart product
      const product = data.data;
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
        quantity: product.quantity,
      };
    } catch (error) {
      return null;
    }
  }
  //
  async findByIds(ids: string[]): Promise<Array<cartProductDTO>> {
    const { data } = await axios.post(
      `${this.baseUrl}/v1/rpc/products/by-ids`,
      {
        ids,
      }
    );
    const product = data.data;
    return product.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      salePrice: product.salePrice,
      quantity: product.quantity,
    }));
  }
}
