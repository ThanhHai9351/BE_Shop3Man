import Joi from "joi";
import UserService from "../services/user-service";
import { Request, Response } from 'express';

const createUser = async (req: Request, res: Response): Promise<Response> => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        address: Joi.string().optional(), 
        dob: Joi.date().optional()
    });
  
    try {
      const { error, value } = schema.validate(req.body);
  
      if (error) {
        return res.status(400).json({
          status: "ERROR",
          message: error.details[0].message,
        });
      }
  
      const respon = await UserService.createUserService(value);
      return res.status(200).json(respon);
  
    } catch (err) {
      return res.status(500).json({
        status: "ERROR",
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  };

  const login = async (req: Request, res: Response): Promise<Response> => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
  
    try {
      const { error, value } = schema.validate(req.body);
  
      if (error) {
        return res.status(400).json({
          status: "ERROR",
          message: error.details[0].message,
        });
      }
  
      const respon = await UserService.loginService(value.email,value.password);
      return res.status(200).json(respon);
  
    } catch (err) {
      return res.status(500).json({
        status: "ERROR",
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  };

  const getUserFromToken = async (req: Request, res: Response): Promise<Response> => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Authorization token is missing or invalid',
        });
      }
    const token = authHeader.split(' ')[1];
      const respon = await UserService.getUserFromToken(token);
      return res.status(200).json(respon);
  
    } catch (err) {
      return res.status(500).json({
        status: "ERROR",
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  };

  const UserController = {createUser,login,getUserFromToken}

  export default UserController