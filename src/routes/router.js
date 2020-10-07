const express = require("express");

const router = express.Router();

const {
  signin: userSignIn,
  signup: userSignUp,
  getuser: getUserData,
  delete: deleteUser,
} = require("../controller/users");

router.get("/user/:id", getUserData);
router.get("/users", getUserData);
router.post("/signin", userSignIn);
router.post("/signup", userSignUp);
router.delete("/user/delete/:id", deleteUser);

module.exports = router;
