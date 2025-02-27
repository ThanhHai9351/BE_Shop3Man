import Joi from "joi"
import { ICategory } from "../models/category.model"

export const DTOCategory = (data: Omit<ICategory, "slug" | "_id">) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    imageUrl: Joi.string().optional(),
    description: Joi.string().optional(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
