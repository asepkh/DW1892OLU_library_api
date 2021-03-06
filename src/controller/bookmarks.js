const { Books, Users, Bookmarks } = require("../../models");

exports.add = async (req, res) => {
  try {
    let payload = req.body;
    const data = await Bookmarks.create(payload);
    res.send({
      message: "This book has been added to your library",
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
    const { UserId, BookId } = req.params;
    const removed = await Bookmarks.destroy({
      where: {
        UserId,
        BookId,
      },
    });

    if (removed) {
      res.send({
        message: "This book has been removed from your library",
        UserId,
        BookId,
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

// exports.getBookmarksUser = async (req, res) => {
//   try {
//     const bookData = await Books.findAll({
//       include: {
//         model: Users,
//         as: "user_bookmarks",
//         through: {
//           model: Bookmarks,
//           as: "info",
//         },
//       },
//     });

//     res.send({
//       message: "Success",
//       data: {
//         book: bookData,
//       },
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).send({
//       error: {
//         message: "Server ERROR",
//       },
//     });
//   }
// };

// exports.getUsersBookmark = async (req, res) => {
//   try {
//     const data = await Users.findAll({
//       include: {
//         model: Books,
//         as: "bookmarks_data",
//         through: {
//           model: Bookmarks,
//           as: "info",
//         },
//       },
//     });

//     res.send({
//       message: "Response Success",
//       data: {
//         bookmarks: data,
//       },
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).send({
//       error: {
//         message: "Server ERROR",
//       },
//     });
//   }
// };
