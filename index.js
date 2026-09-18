require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

const PORT = 8000;

const URL = require("./models/url");
const User = require("./models/user");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

const { checkAuth } = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/url", urlRoute);
app.use("/user", userRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", async (req, res) => {
  const allUrls = await URL.find({});

  res.render("home", {
    urls: allUrls,
  });
});

app.get("/profile", checkAuth, async (req, res) => {
  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.redirect("/user/login");
  }

  res.render("profile", {
    user,
  });
});
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true },
  );

  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
