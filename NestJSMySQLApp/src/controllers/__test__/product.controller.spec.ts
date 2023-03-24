import { Test } from "@nestjs/testing";
import { ProductService } from "src/services/product.service";
import { ProductController } from "src/controllers/product.controller";
import { Product } from "src/entities/product.entity";

describe("ProductController", () => {
  let controller: ProductController;
  let service: ProductService;

  const singleProduct = {
    id: 1,
    prId: "rapidx",
    prName: "rapidx",
  } as Product;

  const multipleProducts = [
    {
      id: 1,
      prId: "rapidx",
      prName: "rapidx",
    },
  ] as Product[];

  beforeEach(async () => {
    const mockService = {
      fetchAll: () => Promise.resolve(multipleProducts),
      fetchOne: (id: number) => Promise.resolve(singleProduct),
      create: (product: Product) => Promise.resolve(product),
      delete: (id: number) => Promise.resolve(singleProduct),
      update: (id: number, product: Partial<Product>) => Promise.resolve(product),
    };

    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(ProductController);
    service = module.get(ProductService);
  });

  describe("fetchAll", () => {
    it("should fetch all products", async () => {
      const products = await controller.fetchAll();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should throw not found exception for the given id", async () => {
      service.fetchOne = (id: number) => Promise.resolve(null);
      await expect(controller.fetchOne("1")).rejects.toThrow();
    });

    it("should return one product for the given id", async () => {
      const product = await controller.fetchOne("1");
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });

  describe("Create product", () => {
    it("should create a product", async () => {
      const product = await controller.create(singleProduct);
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });

  describe("Update product", () => {
    it("should throw not found exception for the given id", async () => {
      service.update = (id: number, product: Partial<Product>) => Promise.resolve(null);
      await expect(controller.update("1", singleProduct)).rejects.toThrow();
    });

    it("should return one product for the given id", async () => {
      const product = await controller.update("1", singleProduct);
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });

  describe("Delete product", () => {
    it("should throw not found exception for the given id", async () => {
      service.delete = (id: number) => Promise.resolve(null);
      await expect(controller.delete("1")).rejects.toThrow();
    });

    it("should return one product for the given id", async () => {
      const product = await controller.delete("1");
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });
});
