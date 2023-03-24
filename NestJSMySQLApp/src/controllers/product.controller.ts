import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { ProductService } from "src/services/product.service";

@Controller("/product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get("")
  fetchAll() {
    return this.productService.fetchAll();
  }

  @Get("/:id")
  async fetchOne(@Param("id") id: string) {
    const product = await this.productService.fetchOne(+id);

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  @Post()
  create(@Body() product: Partial<Product>) {
    return this.productService.create(product);
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() product: Product) {
    const receivedProduct = await this.productService.update(+id, product);

    if (!receivedProduct) throw new NotFoundException("Product not found");

    return receivedProduct;
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    const receivedProduct = await this.productService.delete(+id);

    if (!receivedProduct) throw new NotFoundException("Product not found");

    return receivedProduct;
  }
}
