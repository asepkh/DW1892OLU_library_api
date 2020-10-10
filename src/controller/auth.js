const { Users } = require("../../models");

// Dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi")

// Macros dotenv
const jwtKey = process.env.JWT_KEY;

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    await Users.findOne({
      where: {
        email,
      },
    }).then(function (data) {
      if (data) {
        const validPassword = bcrypt.compare(password, data.password);
        if (!validPassword) {
          return res.status(400).send({
            error: {
              message: "Email or password invalid",
            },
          });
        }
        const token = jwt.sign({
          id: data.id,
        },
          jwtKey
        );

        res.send({
          message: "Login Success",
          data: {
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            token,
          },
        });
      } else {
        return res.status(400).send({
          error: {
            message: "Email or password invalid",
          },
        });
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      email, password, fullName, gender, phone, address, photoUrl, role
    } = req.body;

    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
      fullName: joi.string().min(3).required(),
      gender: joi.string().valid("Male", "Female").required(),
      phone: joi.string().min(10).required(),
      address: joi.string().min(8).required(),
      photoUrl: joi.string().min(3).uri().required(),
      role: joi.string().valid("Guest", "Admin").required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    await Users.findOne({
      where: {
        email,
      },
    }).then(function (data) {
      if (data) {
        return res.status(400).send({
          error: {
            message: "Email already been existed",
          },
        });
      }
    });

    const hashedPassword = await bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10)
    );

    await Users.create({
      email,
      password: hashedPassword,
      fullName,
      gender,
      phone,
      address,
      photoUrl,
      role
    }).then(function (result) {
      const token = jwt.sign(
        {
          id: result.id,
        },
        jwtKey
      );

      res.send({
        message: "success",
        data: {
          email,
          fullName,
          role,
          token,
        },
      });

    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};