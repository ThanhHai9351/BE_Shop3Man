import { Request, Response } from "express"
import ImageService from "../services/image.service"
const uploadImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" })
    }
    const respon = await ImageService.uploadImageService(req.file)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const deleteImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { displayname } = req.body

    if (!displayname) {
      return res.status(400).json({ message: "displayname is required" })
    }

    const respon = await ImageService.deleteImageService(displayname)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const ImageController = { uploadImage, deleteImage }

export default ImageController
