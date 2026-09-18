const express = require("express");
const router = express.Router();

const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/user");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/logout", handleUserLogout);
module.exports = router;
