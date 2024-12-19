import Joi from "joi"

export const DTOWhistlist = (data: any) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
