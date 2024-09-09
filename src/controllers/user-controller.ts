import Joi from "joi";
import UserService from "../services/user-service";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    address: Joi.string().optional(),
    dob: Joi.date().optional(),
    avata: Joi.string().optional(),
    display_avata: Joi.string().optional()
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
      message: err instanceof Error ? err.message : "Unknown error occurred",
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

    const respon = await UserService.loginService(value.email, value.password);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const getUserFromToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "ERROR",
        message: "Authorization token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    const respon = await UserService.getUserFromToken(token);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const respon = await UserService.getAllUsers();
    return res.status(200).json(respon);
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    address: Joi.string().optional(),
    dob: Joi.date().optional(),
    avata: Joi.string().optional(),
  });

  try {
    const id = req.params.id;
    if(!id)
    {
      return res.status(404).json({status: "ERROR",message:"id not found!"})
    }
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }

    const respon = await UserService.updateUserService(id,value);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if(!id)
    {
      return res.status(404).json({status: "ERROR",message:"id not found!"})
    }

    const respon = await UserService.deleteUserService(id);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const UserController = { createUser, login, getUserFromToken, getAllUsers, updateUser,deleteUser };

export default UserController;
