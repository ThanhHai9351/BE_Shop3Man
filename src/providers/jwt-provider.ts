import JWT, { SignOptions } from "jsonwebtoken"
interface JwtPayload {
  [key: string]: any
}

export interface JwtPayloadReturn {
  _id: string
  name: string
  email: string
  role: string
}

const generateToken = async (
  payload: JwtPayload,
  secretSignature: string,
  tokenLife: string | number,
): Promise<string | Error> => {
  try {
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: tokenLife,
    }
    return JWT.sign(payload, secretSignature, options)
  } catch (error) {
    return new Error(error instanceof Error ? error.message : String(error))
  }
}

const verifyToken = async (token: string, secretSignature: string): Promise<JwtPayloadReturn | null> => {
  try {
    const res = (await JWT.verify(token, secretSignature)) as JwtPayloadReturn
    const data = {
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
    }
    return data
  } catch (error: any) {
    console.log(error)
    return null
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken,
}
