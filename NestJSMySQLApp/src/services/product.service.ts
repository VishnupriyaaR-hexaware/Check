import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  fetchAll() {
    return this.productRepo.find();
  }

  fetchOne(id: number) {
    return this.productRepo.findOne({
      where: { id },
    });
  }

  create(product: Partial<Product>) {
    const newProduct = this.productRepo.create(product);
    return this.productRepo.save(newProduct);
  }

  async update(id: number, attrs: Partial<Product>) {
    const product = await this.fetchOne(id);

    if (!product) {
      return null;
    }

    Object.assign(product, attrs);
    return this.productRepo.save(product);
  }

  async delete(id: number) {
    const product = await this.fetchOne(id);

    if (!product) {
      return null;
    }

    return this.productRepo.remove(product);
  }
}
