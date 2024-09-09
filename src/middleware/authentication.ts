import {Request,Response,NextFunction} from 'express'
import { JwtProvider } from '../providers/jwt-provider';

const authenticationRoles = async (req: Request, res: Response, next: NextFunction)=> {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Authorization token is missing or invalid',
        });
      }
    const token = authHeader.split(' ')[1];
    const data : any  = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if(!data)
    {
        return res.status(411).json({
            status: 'ERROR',
            message: 'User not found or token isvalid',
          });
    }
    if(data.role  === 'admin')
    {
        next();
    } else {
        return res.status(403).json({
          status: 'ERROR',
          message: 'Access denied: Admin role required',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "ERROR",
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  };


const authenticationToken = async (req: Request, res: Response, next: NextFunction)=> {
  try {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Authorization token is missing or invalid',
      });
    }
  const token = authHeader.split(' ')[1];
  const data : any  = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
  console.log(data);
  if(!data)
  {
      return res.status(411).json({
          status: 'ERROR',
          message: 'User not found or token isvalid',
        });
  }
  next();
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    });
  }
};

  const Authentication = {authenticationRoles,authenticationToken}

  export default Authentication;