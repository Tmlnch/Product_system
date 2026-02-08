import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: "Username олдсонгүй" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Нууц үг буруу" }), { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Here we include user info in the response
    return new Response(JSON.stringify({
      token,
      user: {
        name: user.name,
        username: user.username,
      }
    }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Серверийн алдаа" }), { status: 500 });
  }
}