const bcrypt = require("bcrypt");
const User = require("../models/user");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      error: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      error: "Invalid email or password",
    });
  }

  req.session.userId = user._id;

  return res.json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
function handleUserLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    return res.json({
      message: "Logout successful",
    });
  });
}
module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
