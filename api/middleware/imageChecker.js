const multer = require("multer");
const uuid = require("uuid").v4;

const image = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images");
        },
        filename: (req, file, cb) => {
            cb(null, "image-" + uuid() + "." + file.mimetype.split("/")[1]);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/webp"
        ) {
            cb(null, true);
        } else {
            cb(
                {
                    message: "Le fichier envoyé n'est pas une image",
                    error: true,
                    status: 400,
                    typeof: "file_not_image",
                },
                false
            );
        }
    },
});

module.exports = image.single("image");
