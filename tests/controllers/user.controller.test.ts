import request from "supertest"
import express, { Express } from "express"
import UserController from "../../src/api/controllers/user.controller"
import UserService from "../../src/api/services/user.service"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

jest.mock("../../src/api/services/user.service")

const app: Express = express()
app.use(express.json())

app.post("/login", UserController.login)

describe("UserController - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return 500 if login service throws error", async () => {
    ;(UserService.loginService as jest.Mock).mockRejectedValue(new Error("Database error"))

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(response.body).toEqual({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    })
  })
})
