const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

exports.authentication = (req, res, next) => {
    let header, token

    if (!(header = req.header("Authorization")) ||
        !(token = header.replace("Bearer ", ""))) {
        return res.status(400).send({
            error: {
                message: "access_denied",
            },
        });
    }

    try {
        const verified = jwt.verify(token, jwtKey);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            error: {
                message: "invalid_token",
            },
        });
    }
};
