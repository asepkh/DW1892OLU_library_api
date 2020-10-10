const { Users } = require("../../models");
const excluded = {
  attributes: {
    exclude: ["createdAt", "updatedAt"],
  },
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    !id
      ? await Users.findAll(excluded).then(function (data) {
          res.send({
            message: "success",
            data,
          });
        })
      : await Users.findOne({
          where: {
            id,
          },
        }).then(function (data) {
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
    await Users.destroy({
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
    await Users.update(updated, {
      where: {
        id,
      },
    }).then(function () {
      res.send({
        message: "success",
        data: {
          id,
          updated,
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
