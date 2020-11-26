const jwt = require("jsonwebtoken");
const multer = require("multer");
const { cloudinary } = require("../../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const jwtKey = process.env.JWT_KEY;
const maxSize = process.env.MULTER_MAX_SIZE;

exports.authentication = {
  authorization: function (req, res, next) {
    let header, token;
    if (
      !(header = req.header("Authorization")) ||
      !(token = header.replace("Bearer ", ""))
    ) {
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
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => {
        let extension = file.fieldname === "file" ? ".epub" : "";
        return {
          folder: `library/${file.fieldname}s`,
          resource_type: file.fieldname === "file" ? "raw" : "image",
          public_id: file.fieldname + "-" + Date.now() + extension,
        };
      },
    });

    const typeFileFilters = function (req, file, cb) {
      if (file.fieldname === "file") {
        if (!file.mimetype.match("application/epub.*")) {
          req.errorValidation = {
            message: "Only PDF File Are Allowed",
          };
          return cb(new Error(req.errorValidation.message), false);
        }
      } else if (
        file.fieldname === "avatar" ||
        file.fieldname === "thumbnail"
      ) {
        if (!file.mimetype.match("image.*")) {
          req.errorValidation = {
            error: {
              message: "Only Image File Are Allowed",
            },
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
            },
          });

        if (req.errorValidation)
          return res.status(400).send(req.errorValidation);

        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              error: {
                message: "Max file sized 10MB",
              },
            });
          }
          return res.status(400).send(err);
        }

        return next();
      });
    };
  },
};
