import Joi from "joi"

export const DTOCreateCategory = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    imageUrl: Joi.string().required(),
    description: Joi.string().optional(),
    slug: Joi.string().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}

export const DTOEditCategory = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    imageUrl: Joi.string().optional(),
    description: Joi.string().optional(),
    slug: Joi.string().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
