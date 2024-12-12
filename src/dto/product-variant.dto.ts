import Joi from "joi"

export const DTOCreateProductVariant = (data: any) => {
  const schema = Joi.object({
    color: Joi.string().required(),
    size: Joi.number().required(),
    stockQuantity: Joi.number().required(),
    price: Joi.number().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
