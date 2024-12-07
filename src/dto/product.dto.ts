import Joi from "joi"

export const DTOCreateCategory = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    slug: Joi.string().required(),
    imageMain: Joi.string().optional(),
    image: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().optional(),
    categoryid: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
