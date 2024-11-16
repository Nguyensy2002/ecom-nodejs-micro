import { PagingDTO } from "../../../share/models/paging";
import { Requester } from "../../user/interface";
import { CartItem, Order, Product } from "../model";
import { OrderCondDTO, OrderCreateDTO, OrderUpdateDTO } from "../model/dto";

export interface IOrderUseCase {
  makeOrder(requester: Requester, data: OrderCreateDTO): Promise<string>;
  updateOrder(
    requester: Requester,
    id: string,
    data: OrderUpdateDTO
  ): Promise<boolean>;
  deleteOrder(
    requester: Requester,
    id: string,
    isHard: boolean
  ): Promise<boolean>;
}
export interface IOrderQueryRepository {
  get(id: string): Promise<Order | null>;
  list(cond: OrderCondDTO, pagination: PagingDTO): Promise<Array<Order>>;
}
export interface IOrderCommandRepository {
  insert(data: Order): Promise<void>;
  update(id: string, data: OrderUpdateDTO): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}
export interface IOrderRepository
  extends IOrderQueryRepository,
    IOrderCommandRepository {}
//driven Ports (RPC service)
export interface ICartQueryRepository {
  listItems(userId: string): Promise<Array<CartItem>>;
  clearItems(userId: string): Promise<void>;
}
export interface IProductQueryRepository {
  findByIds(ids: Array<string>): Promise<Array<Product>>;
}
