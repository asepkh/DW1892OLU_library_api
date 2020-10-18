const { Books, Cats, Users, Bookmarks } = require("../../models");
const Joi = require("@hapi/joi");

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
  userId: Joi.number(),
});

const bookQuery = {
  include: [{
    model: Cats,
    as: "category",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    model: Users,
    as: "author",
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    },
  },],
  attributes: {
    exclude: ["createdAt", "updatedAt", "UserId", "CatId"],
  },
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    let data;
    if (!id) {
      const catId = req.params.category;
      catId ? data = await Books.findAll(
        {
          where: {
            catId,
          },
          include: [{
            model: Cats,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Users,
            as: "author",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },],
          attributes: {
            exclude: ["createdAt", "updatedAt", "UserId", "CatId"],
          },
        }
      ) : data = await Books.findAll(bookQuery);
    } else {
      data = await Books.findOne(
        {
          where: {
            id,
          },
          include: [{
            model: Cats,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Users,
            as: "author",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },],
          attributes: {
            exclude: ["createdAt", "updatedAt", "UserId", "CatId"],
          },
        }
      );
    }

    res.send({
      message: "Response Successfuly",
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

exports.add = async (req, res) => {
  try {
    let payload = req.body;
    const { error } = await schema.validate(payload);
    if (error) {
      return res
        .status(400)
        .send({ error: { message: error.details[0].message, log: payload, } });
    }

    try {
      const category = await Cats.findOne(
        {
          where: {
            name: payload.category,
          },
        });
      payload.catId = category.id
    } catch (error) {
      const categoryCreate = await Cats.create(
        {
          name: payload.category,
        },
      )
      payload.catId = categoryCreate;
    }

    const fullUrl = req.protocol + '://' + req.get('host');
    const thumbnailUrl = fullUrl + "/thumbnail/" + req.files["thumbnail"][0].filename;
    const fileUrl = fullUrl + "/ebook/" + req.files["file"][0].filename;

    const data = await Books.create({
      ...payload,
      thumbnailUrl,
      fileUrl,
    });
    res.send({
      message: payload.status === "Approved" ? "Thank you for adding your own books to our website."
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
    const id = req.params.id;
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