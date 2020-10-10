const { Users } = require("../../models");
const bcrypt = require("bcrypt");

exports.getuser = async (req, res) => {
  try {
    const id = req.params.id;
    let userData;

    if (id) {
      userData = await Users.findOne({
        where: {
          id,
        },
      });
    } else {
      userData = await Users.findAll();
    }

    if (userData) {
      res.send({
        message: "GET user data successfully",
        data: userData,
      });
    } else {
      res.send({
        message: "GET user data failed",
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

exports.signin = async (req, res) => {
  try {
    const payload = req.body;
    const userData = await Users.findOne({
      where: {
        email: payload.email,
      },
    });

    const isLogin = bcrypt.compareSync(payload.password, userData.password);
    console.log(isLogin);
    if (userData && isLogin) {
      res.send({
        message: "Login successfully",
        data: {
          email: userData.email,
          password: userData.password,
        },
      });
    } else {
      res.send({
        message: "Login Failed",
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

exports.signup = async (req, res) => {
  try {
    let payload = req.body;
    const hashPassword = bcrypt.hashSync(
      payload.password,
      bcrypt.genSaltSync(10)
    );
    payload.password = hashPassword;

    const register = await Users.create(payload);

    if (register) {
      res.send({
        message: "Signup successfully",
        data: {
          email: payload.email,
          password: payload.password,
        },
      });
    } else {
      res.send({
        message: "Signup failed",
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
    });

    if (deleted) {
      res.send({
        message: `Delete Success...`,
        id,
      });
    } else {
      res.send({
        message: `Delete failed...`,
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
