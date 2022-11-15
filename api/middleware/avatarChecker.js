const multer = require('multer');
const uuid = require('uuid').v4;

const avatar = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/avatar');
        },
        filename: (req, file, cb) => {
            cb(null, 'avatar-' + uuid() + '.' + file.mimetype.split('/')[1]);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb({
                message: 'Le fichier envoyé n\'est pas une image',
                error: true,
                status: 400,
                typeof: 'file_not_image'
            }, false);
        }
    }
});

module.exports = avatar.single('avatar');