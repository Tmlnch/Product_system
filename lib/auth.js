import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  if (!token) throw new Error("Token missing");
  return jwt.verify(token, SECRET);
};