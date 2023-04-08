const jwt = require("jsonwebtoken");
const JWT_SEC = "JWT_SEC";

const fetchuser = (req, res, next) => {
  // get user from jwt token and add it req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authncate using valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SEC);
    console.log(data);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authncate using valid token" });
  }
};

module.exports = fetchuser;
