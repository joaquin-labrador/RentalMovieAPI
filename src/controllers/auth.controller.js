const bycrypt = require("bcrypt");
const generateToken = require("../utils/genarateToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { prismaError } = require("../errors/databaseerrors");
const singUp = async (req, res) => {
  try {
    const { username, email, password, dni, phone } = req.body;

    const hashedPassword = await bycrypt.hash(password, 12);

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
      isAdmin: false,
      dni: dni,
      phone: phone,
    };

    await prisma.user.create({
      data: newUser,
    });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      maxAge: new Date(Date.now() + 60 * 60 * 24 * 30),
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
  res.end();
};

module.exports = {
  singUp,
  login,
  logout,
};
