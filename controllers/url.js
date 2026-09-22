const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({
      error: "URL is required",
    });
  }

  const shortId = shortid.generate();

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user.userId,
  });

  return res.redirect("/");
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({
      error: "URL not found",
    });
  }

  return res.json({
    totalVisits: result.visitHistory.length,
    visitHistory: result.visitHistory,
  });
}
async function handleDeleteURL(req, res) {
  const shortId = req.params.shortId;

  const url = await URL.findOne({ shortId });

  if (!url) {
    return res.status(404).json({
      error: "URL not found",
    });
  }

  // Check if the logged-in user owns this URL
  if (url.createdBy.toString() !== req.user.userId) {
    return res.status(403).json({
      error: "You are not allowed to delete this URL",
    });
  }

  await URL.deleteOne({ shortId });

  return res.json({
    message: "URL deleted successfully",
  });
}
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleDeleteURL,
};
