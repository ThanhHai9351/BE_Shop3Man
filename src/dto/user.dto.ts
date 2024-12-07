import Joi from "joi"

export const DTOCreateUser = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    dob: Joi.date().required(),
    avatarUrl: Joi.string().optional(),
    phone: Joi.string().optional(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}

export const DTOUpdateUser = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    role: Joi.string().optional(),
    address: Joi.string().optional(),
    dob: Joi.date().optional(),
    avata: Joi.string().optional(),
    display_avatar: Joi.string().optional(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}

export const DTOLoginUser = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error, value } = schema.validate(data)
  return { error, value }
}
