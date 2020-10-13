const { Users } = require("../../models");
const excluded = {
  attributes: {
    exclude: ["createdAt", "updatedAt"],
  },
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    let data = null;
    !id
      ? data = await Users.findAll(excluded)
      : data = await Users.findOne({
        where: {
          id,
        },
      });

    if (data !== null) {
      res.send({
        message: "success",
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

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Users.destroy({
      where: {
        id,
      },
    })

    if (deleted) {
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
    let updated = req.body;
    const patch = await Users.update(updated, {
      where: {
        id,
      },
    })

    if (patch) {
      res.send({
        message: "success",
        data: {
          id,
          updated,
        },
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
