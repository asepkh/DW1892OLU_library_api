const jwt = require("jsonwebtoken");
const multer = require("multer");
const jwtKey = process.env.JWT_KEY;
const ebookDestination = process.env.MULTER_EBOOK_DESTINATION;
const ebookThumbDestination = process.env.MULTER_EBOOK_THUMBNAIL_DESTINATION;
const avatarDestination = process.env.MULTER_AVATAR_DESTINATION;
const maxSize = process.env.MULTER_MAX_SIZE;

exports.authentication = {
    authorization: function (req, res, next) {
        let header, token
        if (!(header = req.header("Authorization")) ||
            !(token = header.replace("Bearer ", ""))) {
            return res.status(400).send({
                error: {
                    message: "access_denied",
                },
            });
        }

        try {
            const verified = jwt.verify(token, jwtKey);
            req.user = verified;
            next();
        } catch (err) {
            console.log(err);
            res.status(400).send({
                error: {
                    message: "invalid_token",
                },
            });
        }
    },

    files_upload: function (uploadFields) {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.originalname.match(/\.(epub|EPUB)$/)) {
                    cb(null, ebookDestination);
                } else {
                    if (file.fieldname === "avatar") {
                        cb(null, avatarDestination);
                    } else {
                        cb(null, ebookThumbDestination);
                    }
                }
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            },
        });

        const typeFileFilters = function (req, file, cb) {
            if (file.fieldname === "file") {
                if (!file.originalname.match(/\.(EPUB|epub)$/)) {
                    req.errorValidation = {
                        message: "Only EPUB Files Are Allowed",
                    };
                    return cb(new Error(req.errorValidation.message), false);
                }
            } else {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
                    req.errorValidation = {
                        error: {
                            message: "Only Image Files Are Allowed",
                        }
                    };
                    return cb(new Error(req.errorValidation.message), false);
                }
            }
            cb(null, true);
        };

        const upload = multer({
            storage,
            fileFilter: typeFileFilters,
            limits: {
                fileSize: parseInt(maxSize),
            },
        }).fields(uploadFields);

        return (req, res, next) => {
            upload(req, res, function (err) {
                if (!req.files && !err)
                    return res.status(400).send({
                        error: {
                            message: "Please select file to upload",
                        }
                    });

                if (req.errorValidation)
                    return res.status(400).send(req.errorValidation);

                if (err) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res.status(400).send({
                            error: {
                                message: "Max file sized 10MB",
                            }
                        });
                    }
                    return res.status(400).send(err);
                }

                return next();
            });
        };
    },
};
