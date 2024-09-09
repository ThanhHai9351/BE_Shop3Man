import { v2 as cloudinary } from "cloudinary";

const uploadImageService = (file: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: file.filename,
      });
      resolve({
        status: "OK",
        message: "upload image successfully!",
        data: uploadResult,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteImageService = (displayname: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const imageResult = await cloudinary.api
        .delete_resources([displayname], {
          type: "delete",
          resource_type: "image",
        })
        resolve({
          status: "OK",
          message: "delete image successfully!",
          data: imageResult,
        });
      } catch (e) {
        reject(e);
      }
    });
  };



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dfdcj7vsn",
  api_key: process.env.API_KEY || "925741211926265",
  api_secret: process.env.API_SECRET || "o_uyoLFAK4ji7Lr95FWH9QggJ6U",
});

const ImageService = { uploadImageService ,deleteImageService};

export default ImageService;
