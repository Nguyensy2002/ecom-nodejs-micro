import axios from "axios";
import { ICartQueryRepository } from "../../../interface";
import { CartItem } from "../../../model";

export class CartQueryRepository implements ICartQueryRepository {
  constructor(private readonly cartServiceUrl: string) {}
  async listItems(userId: string): Promise<Array<CartItem>> {
    const { data } = await axios.post(
      `${this.cartServiceUrl}/v1/rpc/carts/items`,
      { userId }
    );
    return data.data;
  }
  async clearItems(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}