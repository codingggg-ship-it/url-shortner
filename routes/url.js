const express = require("express");

const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleDeleteURL,
} = require("../controllers/url");

const checkJWT = require("../middleware/authJWT");

const router = express.Router();

router.post("/", checkJWT, handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);
router.delete("/:shortId", checkJWT, handleDeleteURL);
module.exports = router;
