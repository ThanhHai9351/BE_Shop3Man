import Joi from "joi"

export const DTOCreateProduct = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    imageUrl: Joi.string().optional(),
    description: Joi.string().optional(),
    categoryId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}

export const DTOEditProduct = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    imageUrl: Joi.string().optional(),
    description: Joi.string().optional(),
    categoryId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).optional(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
