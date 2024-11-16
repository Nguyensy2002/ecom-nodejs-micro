import { v7 } from "uuid";
import {
  ICartCommandRepository,
  ICartQueryRepository,
  ICartUseCase,
  IProductQueryRepository,
} from "../interface";
import {
  addCartItemDTO,
  addCartItemDTOSchema,
  updateCartItemDTO,
  updateCartItemDTOSchema,
} from "../model/dto";
import {
  ErrCartItemNotFound,
  ErrProductNotEnoughQuantity,
  ErrProductNotFound,
} from "../model/error";
import { AppError, ErrForbidden } from "../../../share/utils/app-error";

export class CartService implements ICartUseCase {
  constructor(
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly cartCommanRepo: ICartCommandRepository,
    private readonly prodQueryRepo: IProductQueryRepository
  ) {}

  async addProductToCart(dto: addCartItemDTO): Promise<boolean> {
    const dataDTO = addCartItemDTOSchema.parse(dto);
    const { userId, productId, attribute, quantity } = dataDTO;

    //1. get product
    const product = await this.prodQueryRepo.findById(productId);
    if (!product) {
      throw AppError.from(ErrProductNotFound, 400);
    }
    //check product đã nằm trong cart chưa
    const existingItem = await this.cartQueryRepo.findByCond({
      userId,
      attribute,
      productId,
    });
    console.log("object", existingItem);
    if (existingItem) {
      // tăng số lượng
      const newQuantity = existingItem.quantity + quantity;
      // nếu vượt quá số lượng hàng có trong kho thì in ra lỗi
      if (product.quantity < newQuantity) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400);
      }
      //add more quantity
      await this.cartCommanRepo.update(existingItem.id, {
        ...existingItem,
        quantity: newQuantity,
      });
    } else {
      //check nếu số lượng thêm vào lớn hơn số lượng trong kho thì throw lỗi
      if (product.quantity < quantity) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400);
      }
      // nếu chưa có thì add vào cart
      const newId = v7();
      const newItem = {
        ...dataDTO,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.cartCommanRepo.insert(newItem);
    }
    return true;
  }
  async removeProductFromCart(
    id: string,
    requesterId: string
  ): Promise<boolean> {
    const existingItem = await this.cartQueryRepo.get(id);
    if (!existingItem) {
      throw AppError.from(ErrCartItemNotFound, 400);
    }
    if (existingItem.userId !== requesterId) {
      throw ErrForbidden.withLog("this item does not belong to this user");
    }
    await this.cartCommanRepo.remove(id, false);
    return true;
  }
  async updateProductQuantities(
    dto: updateCartItemDTO[],
    requesterId: string
  ): Promise<boolean> {
    //validate
    dto = dto.map((item) => updateCartItemDTOSchema.parse(item));
    //get product
    const productIds = dto.map((item) => item.productId);
    //lấy ra mảng product id
    const products = await this.prodQueryRepo.findByIds(productIds);
    const productQuantityMap = new Map<string, number>(); //productId -> quantity
    products.forEach((product) =>
      productQuantityMap.set(product.id, product.quantity)
    );
    //check if the product is enough
    dto.map((item) => {
      const userWantQuantity = item.quantity;
      const currentQuantity = productQuantityMap.get(item.productId) || 0;
      if (userWantQuantity > currentQuantity) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400);
      }
    });
    await this.cartCommanRepo.updateMany(dto, requesterId);
    return true;
  }
}
