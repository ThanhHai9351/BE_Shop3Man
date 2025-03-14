import Joi from "joi"
import { ICart } from "../models/cart.model"

export const DTOCart = (data: Omit<ICart, "_id" | "userId" | "product">) => {
  const schema = Joi.object({
    color: Joi.string().required(),
    size: Joi.number().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
