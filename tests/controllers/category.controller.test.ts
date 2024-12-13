import request from "supertest"
import CategoryController from "../../src/controllers/category.controller"
import CategoryService from "../../src/services/category.service"
import { app } from "../../src/socket/socket"

jest.mock("../../src/services/category.service", () => ({
  getAllCategoryService: jest.fn(),
}))

app.get("/api/category", CategoryController.getAllCategories)

describe("CategoryController", () => {
  describe("getAllCategories", () => {
    it("should return all categories with status 200", async () => {
      ;(CategoryService.getAllCategoryService as jest.Mock).mockResolvedValue({
        data: [],
        total: 0,
      })

      const res = await request(app).get("/api/category").query({
        limit: 10,
        page: 1,
        search: "",
        sortDir: "asc",
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ data: [], total: 0 })
      expect(CategoryService.getAllCategoryService).toHaveBeenCalledWith(10, 1, "", "asc")
    })

    it("should return status 500 if there is a server error", async () => {
      ;(CategoryService.getAllCategoryService as jest.Mock).mockRejectedValue(new Error("Server Error"))

      await request(app).get("/api/category")
    })
  })
})
