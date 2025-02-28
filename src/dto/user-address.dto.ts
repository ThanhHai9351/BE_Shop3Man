import Joi from "joi"

export const DTOCreateAddress = (data: any) => {
  const schema = Joi.object({
    city: Joi.string().required(),
    district: Joi.string().required(),
    street: Joi.string().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
