const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

const JWT_SEC = "JWT_SEC";

const router = express.Router();

// ROUTE-1 create user using post 'api/auth/createuser' :dosen't  require authentictaion no login required
router.post(
  "/createuser",
  // express validation
  [
    body("email", "Please enter valid email").isEmail(),
    body("name", "Please enter valid name atleast 5 character").isLength({
      min: 5,
    }),
    body("password", "Please enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // console.log(req.body);

    try {
      let success=false;
      const error = validationResult(req);

      // check wheater error occured or not
      if (!error.isEmpty()) {
        success=false;
        res.status(400).json({ error: error.array() });
        
      }

      // Check the user with email exist already

      let user = await User.findOne({ email: req.body.email });
      // console.log(user);

      if (user) {
        success=false;
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // console.log(salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // res.json(user);
      const data = {
        user: { id: user.id },
      };
      const authtoken = jwt.sign(data, JWT_SEC);
      success=true;
      //  console.log(jwtData)
      res.json({ authtoken, data,success });
    } catch (error) {
      res.status(500).send("Some error occured please try again");
    }
  }
);

// ROUTE-2 authincate user

router.post(
  "/login",
  // express validatior
  [
    body("email", "Please enter valid email").isEmail(),
    body("password", "Please enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      let success = false;
      const error = validationResult(req);

      // check wheater error occured or not
      if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
      }
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      // console.log(user);

      if (!user) {
         success = false;
        return res.status(400).json({
          error: "Please try to login with correct credeintail,user not found",
        });
      }

      let passwordComapare = await bcrypt.compare(password, user.password);

      if (!passwordComapare) {
         success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credeintail" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SEC);
      success=true
      res.json({ authtoken,success });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured please try again");
    }
  }
);

// ROUTE 3 get logged in user details using POST api/auth/getuser
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(userId)
    const user = await User.findById(userId).select("-password");
    // console.log(user);
    res.send(user);
  } catch (error) {
    res.status(500).send("Some error occured please try again");
  }
});

module.exports = router;
