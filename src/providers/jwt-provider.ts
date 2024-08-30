import JWT, { SignOptions } from 'jsonwebtoken';

interface JwtPayload {
  [key: string]: any;
}

const generateToken = async (
  payload: JwtPayload,
  secretSignature: string,
  tokenLife: string | number
): Promise<string | Error> => {
  try {
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: tokenLife,
    };
    return JWT.sign(payload, secretSignature, options);
  } catch (error) {
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

const verifyToken = async (
  token: string,
  secretSignature: string
): Promise<JwtPayload | Error> => {
  try {
    return JWT.verify(token, secretSignature) as JwtPayload;
  } catch (error) {
    return new Error( error.message);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
