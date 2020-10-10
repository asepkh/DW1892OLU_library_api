const { Cats } = require("../../models");
const excluded = {
  attributes: {
    exclude: ["createdAt", "updatedAt"],
  },
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    !id
      ? await Cats.findAll(excluded).then(function (data) {
          res.send({
            message: "success",
            data,
          });
        })
      : await Cats.findOne(
          {
            where: {
              id,
            },
          },
          excluded
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
    await Cats.create(payload).then(function (data) {
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
    await Cats.destroy({
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
    await Cats.update(updated, {
      where: {
        id,
      },
    }).then(() => {
      res.send({
        message: "success",
        data: {
          id,
          category: updated.name,
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
