import { Request, Response } from "express";
import {
  CategoryCondDTOSchema,
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from "../../model/dto";

import { Category } from "../../model/model";
import { ICategoryUseCase } from "../../interface";

export class CategoryHttpService {
  constructor(private readonly service: ICategoryUseCase) {}
  async createAnewCategoryAPI(req: Request, res: Response) {
    try {
      const result = await this.service.createAnewCategory(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
  async getDetailtCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.service.getDetailtCategory(id);
    res.status(200).json({ data: result });
  }
  async listCategoryAPI(req: Request, res: Response) {
    //điều kiện lọc sản phẩm
    const cond = CategoryCondDTOSchema.parse(req.query);
    const paging = {
      page: 1,
      limit: 100,
    };
    const result = await this.service.listCategories(cond, paging);
    const categoriesTree = this.builderTree(result);
    res
      .status(200)
      .json({ data: categoriesTree, paging: paging, filter: cond });
  }
  //thuật toán lấy ra danh sách và phân chia cấp cha con
  private builderTree(categories: Category[]): Category[] {
    //tạo ra một mảng mới
    const categoriesTree: Category[] = [];
    const mapChildren = new Map<string, Category[]>();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (!mapChildren.get(category.id)) {
        mapChildren.set(category.id, []);
      }
      category.children = mapChildren.get(category.id);
      if (!category.parentId) {
        categoriesTree.push(category);
      } else {
        const childrent = mapChildren.get(category.parentId);
        childrent
          ? childrent.push(category)
          : mapChildren.set(category.parentId, [category]);
      }
    }
    return categoriesTree;
  }
  async updateCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    const result = await this.service.updateCategory(id, data);
    return res.status(200).json({ data: result });
  }
  async deleteCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.service.deleteCategory(id);
    return res.status(200).json({ data: result });
  }
}
