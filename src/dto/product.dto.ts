import Joi from "joi"

export const DTOCreateCategory = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    slug: Joi.string().required(),
    imageUrl: Joi.string().required(),
    description: Joi.string().optional(),
    categoryId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}

export const DTOEditCategory = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    slug: Joi.string().optional(),
    imageUrl: Joi.string().optional(),
    description: Joi.string().optional(),
    categoryId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).optional(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
