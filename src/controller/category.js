const { Cats } = require("../../models");
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
      ? data = await Cats.findAll(excluded)
      : data = await Cats.findOne(
        {
          where: {
            id,
          },
        },
        excluded
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
    const data = await Cats.create(payload)

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
    const removed = await Cats.destroy({
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
    const updated = await Cats.update(payload, {
      where: {
        id,
      },
    });
    if (updated) {
      res.send({
        message: "success",
        data: {
          id,
          category: payload.name,
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
