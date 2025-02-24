const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema.js");
require("dotenv").config();

async function verifyJwt(req, res, next) {
  const jsonwebtoken = req.cookies.jwt;

  await jwt.verify(
    jsonwebtoken,
    process.env.SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ msg: "user not authenticated" });
      }

      console.log(decoded);
      let email = decoded.email;
      req.user = decoded;

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).send({ msg: "User not found" });
        }
        req.user.id = user._id;
        next(); // Ensure next() is called after everything is done
      } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Server error" });
      }
    }
  );
}

module.exports = verifyJwt;
