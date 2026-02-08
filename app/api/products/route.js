import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

/*
  Function: getBearerToken(req)
  Purpose : Request header deerh Authorization: Bearer <token> -oos token salgaj avna
  Return  : token string (baival)
  Throw   : token bhgui esvel format buru bol Error shidne
*/
function getBearerToken(req) {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  return authHeader.split(" ")[1];
}

/*
  Function: GET(req)
  Purpose : Products jagsaaltiig token-oor shalgaj avaad DB-ees unshij butsaana
  Flow    :
    1) Token gargaj avna
    2) Token verify hiine
    3) DB connect hiine
    4) Products find + sort hiine
    5) JSON response butsaana
*/
export async function GET(req) {
  try {
    const token = getBearerToken(req);
    verifyToken(token); // hereglegch valid esehiig shalgana

    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

/*
  Function: POST(req)
  Purpose : Shine product uusgeh (token shaardlagatai)
  Flow    :
    1) Token gargaj avna
    2) Token verify hiine
    3) Body json unshina
    4) Validation hiine (talbar dutuu eseh, ognoo zov eseh)
    5) DB connect hiine
    6) Product create hiine
    7) JSON response butsaana
*/
export async function POST(req) {
  try {
    const token = getBearerToken(req);
    verifyToken(token);

    const { productId, manufactureDate, expiryDate, imageUrl } = await req.json();

    if (!productId || !manufactureDate || !expiryDate) {
      return new Response(JSON.stringify({ error: "Medeelel dutuu" }), { status: 400 });
    }

    if (new Date(expiryDate) <= new Date(manufactureDate)) {
      return new Response(JSON.stringify({ error: "Duusah ognoo buru baina" }), { status: 400 });
    }

    await connectDB();

    const product = await Product.create({
      productId,
      manufactureDate,
      expiryDate,
      imageUrl: imageUrl || null,
    });

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}