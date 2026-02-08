import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, username, password } = await req.json();

  if (!name || !username || !password) {
    return new Response(JSON.stringify({ message: "Бүх талбар шаардлагатай" }), { status: 400 });
  }

  const exist = await User.findOne({ username });
  if (exist) return new Response(JSON.stringify({ message: "Username бүртгэлтэй байна" }), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, username, password: hashed });

  return new Response(JSON.stringify({ message: "Бүртгэл амжилттай" }), { status: 201 });
}