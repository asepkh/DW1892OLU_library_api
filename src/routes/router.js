const express = require("express");
require('dotenv').config()

const router = express.Router();

// >>>>>>>> Authentication <<<<<<<<<
const {
  signin: userSignIn,
  signup: userSignUp,
} = require("../controller/auth");

const { authentication } = require("../middleware/auth.js");

router.post("/signin", userSignIn);
router.post("/signup", userSignUp);

// >>>>>>>> Users And Auth <<<<<<<<<
const {
  get: getUserData,
  delete: deleteUser,
  patch: updateUser,
} = require("../controller/users");

router.get("/users", authentication, getUserData);

router.get("/user/:id", authentication, getUserData);
router.patch("/user/:id", authentication, updateUser);
router.delete("/user/:id", authentication, deleteUser);

// >>>>>>>>>>> Books <<<<<<<<<<<<<<<
const {
  add: addBook,
  get: getBookData,
  delete: deleteBook,
  patch: updateBook,
} = require("../controller/books");

router.get("/books", authentication, getBookData);

router.get("/book/:id", authentication, getBookData);
router.patch("/book/:id", authentication, updateBook);
router.delete("/book/:id", authentication, deleteBook);

router.post("/book/add", authentication, addBook);

// >>>>>>>>>>> Category <<<<<<<<<<<<<<<
const {
  add: addCategory,
  get: getCategoryData,
  delete: deleteCategory,
  patch: updateCategory,
} = require("../controller/category");
router.get("/categories", authentication, getCategoryData);

router.get("/category/:id", authentication, getCategoryData);
router.patch("/category/:id", authentication, updateCategory);
router.delete("/category/:id", authentication, deleteCategory);

router.post("/category/add", authentication, addCategory);

module.exports = router;
