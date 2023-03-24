import { Product } from "src/entities/product.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductService } from "src/services/product.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";

describe("ProductService", () => {
  let service: ProductService;
  let repo: Repository<Product>;

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
    const mockRepo = {
      find: () => Promise.resolve(multipleProducts),
      findOne: (id: number) => Promise.resolve(singleProduct),
      save: (product: Product) => Promise.resolve(product),
      create: (product: Product) => product,
      remove: (product: Product) => Promise.resolve(product),
    };

    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(ProductService);
    repo = module.get(getRepositoryToken(Product));
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  describe("fetchAll", () => {
    it("should fetch all products from database", async () => {
      const products = await service.fetchAll();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe("fetchOne", () => {
    it("should fetch one product from the database", async () => {
      const product = await service.fetchOne(1);
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
    it("should fetch no products from database", async () => {
      repo.findOne = () => Promise.resolve(null);
      const product = await service.fetchOne(1);
      expect(product).toBeNull();
    });
  });

  describe("Create product", () => {
    it("should create the product of the specified values", async () => {
      const product = await service.create(singleProduct);
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });

  describe("Update product", () => {
    it("should return null when product is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const product = await service.update(1, {});
      expect(product).toBeNull();
    });

    it("should update the product of the specified id", async () => {
      const product = await service.update(1, singleProduct);
      expect(product.prId).toEqual(singleProduct.prId);
      expect(product.prName).toEqual(singleProduct.prName);
    });
  });

  describe("Delete product", () => {
    it("should return null when product is not available", async () => {
      repo.findOne = () => Promise.resolve(null);
      const product = await service.delete(1);
      expect(product).toBeNull();
    });

    it("should delete the product of the specified id", async () => {
      const product = await service.delete(1);
      expect(product.id).toEqual(1);
    });
  });
});
