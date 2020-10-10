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
    !id
      ? await Books.findAll(bookQuery).then(function (data) {
        res.send({
          message: "success",
          data,
        });
      })
      : await Books.findOne(
        bookQuery,
        {
          where: {
            id,
          },
        }
      ).then(function (data) {
        res.send({
          message: "success",
          data,
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

exports.add = async (req, res) => {
  try {
    let payload = req.body;
    await Books.create(payload).then(function (data) {
      res.send({
        message: "success",
        data,
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

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Books.destroy({
      where: {
        id,
      },
    }).then(function (data) {
      res.send({
        message: "success",
        id,
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

exports.patch = async (req, res) => {
  try {
    const id = req.params.id;
    let updated = req.body;
    await Books.update(updated, {
      where: {
        id,
      },
    }).then(() => {
      res.send({
        message: "success",
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