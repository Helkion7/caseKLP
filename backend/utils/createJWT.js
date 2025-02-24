const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createJWT(email, role) {
  const jwtToken = jwt.sign(
    { email: email, role: "user" },
    process.env.SECRET_KEY
  );
  console.log(jwtToken);
  return jwtToken;
}

module.exports = createJWT;
