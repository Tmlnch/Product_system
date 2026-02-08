import 'dotenv/config';
import connectDB from "./lib/mongodb.js";
import Product from "./models/Product.js";


// zuragnuud
const images = [
  "/uploads/milk.png",
  "/uploads/smoothie.png",
  "/uploads/bansh.png",
  "/uploads/skitties.png",
  "/uploads/bread.png"
];

// random expiry date
function getRandomExpiry(manufactureDate) {
  const minDays = 30;
  const maxDays = 365;
  const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const expiry = new Date(manufactureDate);
  expiry.setDate(expiry.getDate() + randomDays);
  return expiry;
}

// 20 product uusgeh
const seedProducts = Array.from({ length: 20 }).map((_, i) => {
  const manufactureDate = new Date(2026, 0, i + 1); // Jan 1–20
  const imageUrl = images[i % images.length]; // зураг 5-аар давтагдана
  return {
    productId: `P${(i + 1).toString().padStart(3, "0")}`,
    manufactureDate,
    expiryDate: getRandomExpiry(manufactureDate),
    imageUrl
  };
});

async function seedDB() {
  try {
    await connectDB();
    console.log("MongoDB connected, starting seeding...");

    // Хуучин өгөгдлийг цэвэрлэх
    await Product.deleteMany({});
    console.log("Old products deleted.");

    // Шинэ seed data нэмэх
    await Product.insertMany(seedProducts);
    console.log("20 products seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDB();