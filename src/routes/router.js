const express = require("express");
require("dotenv").config();

const router = express.Router();

// >>>>>>>> Authentication <<<<<<<<<
const {
  signin: userSignIn,
  signup: userSignUp,
  AuthCheck: userAuthCheck,
} = require("../controller/auth");

const { authentication } = require("../middleware/auth.js");

router.post("/signin", userSignIn);
router.post("/signup", userSignUp);
router.get("/auth", [authentication.authorization], userAuthCheck);

// >>>>>>>> Users And Auth <<<<<<<<<
const {
  get: getUserData,
  delete: deleteUser,
  patch: updateUser,
  patch_avatar: updateUserAvatar,
} = require("../controller/users");

router.get("/users", [authentication.authorization], getUserData);

router.get("/user/:id", [authentication.authorization], getUserData);
router.patch("/user/:id", [authentication.authorization], updateUser);
router.patch(
  "/user/avatar",
  [
    authentication.authorization,
    authentication.files_upload([{ name: "avatar", maxCount: 1 }]),
  ],
  updateUserAvatar
);
router.delete("/user/:id", [authentication.authorization], deleteUser);

// >>>>>>>>>>> Books <<<<<<<<<<<<<<<
const {
  add: addBook,
  get: getBookData,
  delete: deleteBook,
  patch: updateBook,
} = require("../controller/books");

router.get("/books", [authentication.authorization], getBookData);

router.post(
  "/book",
  [
    authentication.authorization,
    authentication.files_upload([
      { name: "thumbnail", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
  ],
  addBook
);

router.get("/book/:id", [authentication.authorization], getBookData);
router.patch("/book/:id", [authentication.authorization], updateBook);
router.delete("/book/:id", [authentication.authorization], deleteBook);

// >>>>>>>>>>> Category <<<<<<<<<<<<<<<
const {
  add: addCategory,
  get: getCategoryData,
  delete: deleteCategory,
  patch: updateCategory,
} = require("../controller/category");
router.get("/categories", [authentication.authorization], getCategoryData);

router.post("/category", [authentication.authorization], addCategory);
router.get("/category/:id", [authentication.authorization], getCategoryData);
router.patch("/category/:id", [authentication.authorization], updateCategory);
router.delete("/category/:id", [authentication.authorization], deleteCategory);

// >>>>>>>>>>> Bookmark <<<<<<<<<<<<<<<<
const {
  add: addBookmark,
  delete: deleteBookmark,
} = require("../controller/bookmarks");
router.post("/bookmark", [authentication.authorization], addBookmark);
router.delete(
  "/bookmark/:BookId",
  [authentication.authorization],
  deleteBookmark
);

module.exports = router;
