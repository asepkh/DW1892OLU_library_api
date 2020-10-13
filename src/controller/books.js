const { Books, Cats, Users } = require("../../models");
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
    let data = null;

    !id ? data = await Books.findAll(bookQuery)
      : data = await Books.findOne(
        bookQuery,
        {
          where: {
            id,
          },
        }
      );

    res.send({
      message: "success",
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
    const data = await Books.create(payload);
    res.send({
      message: "success",
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
        message: "success",
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
  try {
    const id = req.params.id;
    let payload = req.body;
    const updated = await Books.update(payload, {
      where: {
        id,
      },
    });

    if (updated) {
      res.send({
        message: "success",
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