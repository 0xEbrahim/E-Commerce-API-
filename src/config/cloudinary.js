import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "djsmnq0qv",
  api_key: "998254671466668",
  api_secret: "2yJpD6UidOEhbeNrBu5meTMw2D8",
  //sign_url: process.env.CLOUDINARY_URL,
});

const cloudinaryUpload = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (result) => {
      resolve(
        {
          url: result.url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

const uploader = async (path) => await cloudinaryUpload(path, "image");
export default uploader;
