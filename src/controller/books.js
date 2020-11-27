const { Books, Cats, Users } = require("../../models");
const Joi = require("@hapi/joi");
const { Op } = require("sequelize");

const schema = Joi.object({
  title: Joi.string().min(6).required(),
  publication: Joi.string().required(),
  category: Joi.string().required(),
  pages: Joi.number().required(),
  isbn: Joi.string().required(),
  aboutBook: Joi.string().required(),
  file: Joi.string(),
  thumbnail: Joi.string(),
  status: Joi.string(),
});

exports.get = async (req, res) => {
  try {
    const {
      status,
      sort,
      order,
      author,
      category,
      page: pageQuery,
      limit: limitQuery,
    } = req.query;
    const { id } = req.params;

    const page = pageQuery ? pageQuery - 1 : 0;
    const pageSize = parseInt(limitQuery ? limitQuery : 8);

    const bookQuery = {
      where: {
        [Op.and]: [
          status && {
            status: status,
          },
          category && {
            category: category,
          },
        ],
      },
      include: {
        model: Users,
        as: "author",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        where: {
          [Op.and]: [author && { id: author }],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [
        ["createdAt", "DESC"],
        [sort || "id", order || "ASC"],
      ],
      offset: page * pageSize,
      limit: pageSize,
    };

    const data = !id
      ? await Books.findAll(bookQuery)
      : await Books.findOne({
          where: {
            id,
          },
          include: [
            {
              model: Users,
              as: "author",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: Cats,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

    if (data) {
      res.send({
        message: "Response Successfully",
        data,
      });
    } else {
      res.status(500).send({
        message: "Not Found",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.add = async (req, res) => {
  try {
    let payload = req.body;
    const { error } = await schema.validate(payload);
    if (error) {
      return res
        .status(400)
        .send({ error: { message: error.details[0].message } });
    }

    try {
      const category = await Cats.findOne({
        where: {
          name: payload.category,
        },
      });
      payload.CatId = category.id;
    } catch (error) {
      const categoryCreate = await Cats.create({
        name: payload.category,
      });
      payload.CatId = categoryCreate.id;
    }

    const thumbnailUrl = req.files["thumbnail"][0].path;
    const fileUrl = req.files["file"][0].path;

    const data = await Books.create({
      ...payload,
      UserId: req.user.id,
      thumbnailUrl,
      fileUrl,
    });
    res.send({
      message:
        payload.status === "Approved"
          ? "Thank you for adding your own books to our website."
          : "Thank you for adding your own books to our website, please wait 1 x 24 hours to verifying by admin",
      data,
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

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Books.destroy({
      where: {
        id,
      },
    });

    if (removed) {
      res.send({
        message: "Successfully Deleted",
        id,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.patch = async (req, res) => {
  let data = req.body;

  try {
    const id = req.params.id;
    const updated = await Books.update(data, {
      where: {
        id,
      },
    });

    if (updated) {
      res.send({
        message: "Successfully Updated",
        data,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};
