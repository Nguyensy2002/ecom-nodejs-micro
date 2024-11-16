import {
  ICartQueryRepository,
  ICartUseCase,
  IProductQueryRepository,
} from "../../interface";
import { Request, Response } from "express";
import { cartItemDTO } from "../../model/cart";

export class CartController {
  constructor(
    private readonly cartService: ICartUseCase,
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly productQueryRepo: IProductQueryRepository
  ) {}
  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = { ...req.body, userId };
    const result = await this.cartService.addProductToCart(dto);
    res.status(200).json({ data: result });
  }
  async removeProductFromCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const { id } = req.params;
    const result = await this.cartService.removeProductFromCart(id, userId);
    res.status(200).json({ data: result });
  }
  async updateProductQuantitiesAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = req.body;
    await this.cartService.updateProductQuantities(dto, userId);
    res.status(200).json({ data: true });
  }
  async listItemsAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const items = await this.cartQueryRepo.listItems(userId);
    //get product ids
    const productIds = items.map((item) => item.productId);
    const itemMap = new Map<string, cartItemDTO>(); //productId -> cartItemDTO
    items.forEach((item) => itemMap.set(item.productId, item));
    const products = await this.productQueryRepo.findByIds(productIds);
    products.forEach((product) => {
      const item = itemMap.get(product.id);
      if (item) item.product = product;
    });
    res.status(200).json({ data: items });
  }
  // call api rpc of order
  async listItemsRPC(req: Request, res: Response) {
    const { userId } = req.body;
    const items = await this.cartQueryRepo.listItems(userId);
    //get product ids
    const productIds = items.map((item) => item.productId);
    const itemMap = new Map<string, cartItemDTO>(); //productId -> cartItemDTO
    items.forEach((item) => itemMap.set(item.productId, item));
    const products = await this.productQueryRepo.findByIds(productIds);
    products.forEach((product) => {
      const item = itemMap.get(product.id);
      if (item) item.product = product;
    });
    res.status(200).json({ data: items });
  }
}
