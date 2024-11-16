import { Sequelize } from "sequelize";
import { IOrderCommandRepository } from "../../../interface";
import { Order } from "../../../model";
import { OrderUpdateDTO } from "../../../model/dto";
import { OrderItemPersistence, OrderPersistence } from ".";

export class OrderCommandRepository implements IOrderCommandRepository {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
  async insert(data: Order): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      //Thao tác tạo 1 bản ghi mới trong bảng Order
      //transaction: t chỉ ra thao tác này chỉ thực hiện trong 1 giao dịch, được đại diện bởi t
      //Giúp đảm bảo mọi thay đổi trong dữ liệu được thực hiện đồng bộ
      await OrderPersistence.create(data, { transaction: t });
      //cho phép thêm nhiều bản ghi (nhiều món hàng trong đơn hàng) vào bảng orderItem
      await OrderItemPersistence.bulkCreate(data.items, { transaction: t });
    });
  }
  update(id: string, data: OrderUpdateDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string, isHard: boolean): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
