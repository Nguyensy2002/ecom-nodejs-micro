import { cartItemDTO, cartProductDTO } from "../model/cart";
import {
  addCartItemCondDTO,
  addCartItemDTO,
  updateCartItemDTO,
} from "../model/dto";

export interface ICartUseCase {
  addProductToCart(dto: addCartItemDTO): Promise<boolean>;
  removeProductFromCart(id: string, requesterId: string): Promise<boolean>;
  updateProductQuantities(
    dto: updateCartItemDTO[],
    requesterId: string
  ): Promise<boolean>;
}
export interface ICartQueryRepository {
  get(id: string): Promise<cartItemDTO | null>;
  listItems(userId: string): Promise<Array<cartItemDTO>>;
  findByCond(cond: addCartItemCondDTO): Promise<Array<cartItemDTO> | null>;
}
//interface thêm sản phẩm vào giỏ hàng
export interface ICartCommandRepository {
  insert(data: cartItemDTO): Promise<boolean>;
  update(id: string, data: cartItemDTO): Promise<boolean>;
  updateMany(dto: updateCartItemDTO[], userId: string): Promise<boolean>;
  remove(id: string, isHash: boolean): Promise<boolean>;
}
//interface thông tin sản phẩm trong giỏ hàng
export interface IProductQueryRepository {
  findById(id: string): Promise<cartProductDTO | null>;
  findByIds(ids: string[]): Promise<Array<cartProductDTO>>;
}
