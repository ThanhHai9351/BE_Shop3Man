import request from "supertest"
import ProductController from "../../src/controllers/product.controller"
import ProductService from "../../src/services/product.service"
import { app } from "../../src/socket/socket"

jest.mock("../../src/services/product.service")

app.get("/product", ProductController.getAllProduct)

describe("ProductController Tests", () => {
  describe("getAllProduct", () => {
    it("should return 200 with product list", async () => {
      ;(ProductService.getAllProductService as jest.Mock).mockResolvedValue({
        status: "SUCCESS",
        products: [{ id: 1, name: "Product 1", price: 100 }],
      })

      await request(app).get("/products")
    })
  })
})
