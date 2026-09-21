const express = require("express");
const router = express.Router();
const checkJWT = require("../middleware/authJWT");
const { signupUser, loginUser, logoutUser } = require("../controllers/user");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", checkJWT, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});
module.exports = router;
