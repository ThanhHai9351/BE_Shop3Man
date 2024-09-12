import ProductService from "../services/product-service";
import Joi from "joi";
import { Request, Response } from "express";

const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    imageMain: Joi.string().optional(),
    image: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().optional(),
    categoryid: Joi.string()
      .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
      .required(),
    quantity: Joi.number().required(),
    color: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          size: Joi.array()
            .items(
              Joi.object({
                numberSize: Joi.number().required(),
                quantity: Joi.number().required(),
              })
            )
            .required(),
        })
      )
      .optional(),
    size: Joi.array()
      .items(
        Joi.object({
          numberSize: Joi.number().required(),
          color: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().required(),
              })
            )
            .required(),
        })
      )
      .optional(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }

    const respon = await ProductService.createProductService(value);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};
const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    imageMain: Joi.string().optional(),
    image: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().optional(),
    categoryid: Joi.string()
      .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
      .optional(),
    quantity: Joi.number().optional(),
    color: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().optional(),
          size: Joi.array()
            .items(
              Joi.object({
                numberSize: Joi.number().optional(),
                quantity: Joi.number().optional(),
              })
            )
            .optional(),
        })
      )
      .optional(),
    size: Joi.array()
      .items(
        Joi.object({
          numberSize: Joi.number().optional(),
          color: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().optional(),
                quantity: Joi.number().optional(),
              })
            )
            .optional(),
        })
      )
      .optional(),
  });

  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "Id isvalid",
      });
    }

    const respon = await ProductService.updateProductService(id, value);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const detailProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "Id isvalid",
      });
    }

    const respon = await ProductService.detailProductService(id);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const getAllProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const respon = await ProductService.getAllPRoductService();
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
};

const deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({
          status: "ERROR",
          message: "Id isvalid",
        });
      }
  
      const respon = await ProductService.deleteProductService(id);
      return res.status(200).json(respon);
    } catch (err) {
      return res.status(500).json({
        status: "ERROR",
        message: err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  };
const ProductController = { createProduct, updateProduct, detailProduct,deleteProduct,getAllProduct };

export default ProductController;
