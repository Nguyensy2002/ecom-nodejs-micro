import { v7 } from "uuid";
import { Requester } from "../../user/interface";
import {
  ICartQueryRepository,
  IOrderCommandRepository,
  IOrderQueryRepository,
  IOrderUseCase,
} from "../interface";
import { Order, OrderItem, OrderStatus, PaymentStatus } from "../model";
import {
  OrderCreateDTO,
  orderCreateSchema,
  OrderUpdateDTO,
} from "../model/dto";
import { generateRandomString } from "../../../share/utils/util";

export class OrderUseCase implements IOrderUseCase {
  constructor(
    // private readonly orderQueryRepo: IOrderQueryRepository,
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly cartQueryRepo: ICartQueryRepository
  ) {}
  async makeOrder(requester: Requester, data: OrderCreateDTO): Promise<string> {
    const { sub: userId } = requester;
    data = orderCreateSchema.parse(data);
    // Lấy ra danh sách các item cart
    const cartItems = await this.cartQueryRepo.listItems(userId);
    //check if the product is enough
    const newId = v7();
    const trackingNumber = generateRandomString(8);
    //map ra từng item cart
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      id: v7(),
      orderId: newId,
      productId: item.productId,
      name: item.product.name,
      attribute: item.attribute ?? "",
      price: item.product.salePrice,
      quantity: item.quantity,
    }));
    //tạo đơn hàng
    const order: Order = {
      id: newId,
      userId,
      ...data,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      trackingNumber,
      items: orderItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.orderCommandRepo.insert(order);
    return newId;
  }
  updateOrder(
    requester: Requester,
    id: string,
    data: OrderUpdateDTO
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteOrder(
    requester: Requester,
    id: string,
    isHard: boolean
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
