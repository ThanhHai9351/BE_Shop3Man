import request from "supertest"
import express, { Express } from "express"
import UserController from "../../src/controllers/user.controller"
import UserService from "../../src/services/user.service"

jest.mock("../../src/services/user.service")

const app: Express = express()
app.use(express.json())

app.post("/login", UserController.login)

describe("login", () => {
  it("should return 200 on successful login", async () => {
    ;(UserService.loginService as jest.Mock).mockResolvedValue({
      status: "SUCCESS",
      token: "mock-jwt-token",
    })

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      status: "SUCCESS",
      token: "mock-jwt-token",
    })
  })

  it("should return 400 if validation fails", async () => {
    const response = await request(app).post("/login").send({ email: "hai@gmail.com" })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message")
  })
})
