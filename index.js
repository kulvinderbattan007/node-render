import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import TestMessage from "./models/TestMessage.js";
// import axios from "axios";
import Shop from "./models/Shop.js";
import OAuthDebug from "./models/OAuthDebug.js";

dotenv.config(); // ✅ Load env FIRST

/* 👉 CONNECT DATABASE */
connectDB();

const app = express(); 
const port = process.env.PORT || 3001;

/* -----------------------------
   ENV VARIABLES
------------------------------*/
const API_KEY = process.env.SHOPIFY_API_KEY; 
const API_SECRET = process.env.SHOPIFY_API_SECRET;
const REDIRECT_URL = process.env.SHOPIFY_REDIRECT_URL;

/* -----------------------------
   BASIC ROUTES
------------------------------*/
app.get("/", (req, res) => {
  res.send("Hello World! b");
});

app.get("/api", (req, res) => {
  res.send("Hello World! API");
});

/* -----------------------------
   STEP 1 → START INSTALL
------------------------------*/
app.get("/auth", (req, res) => {
  const { shop } = req.query;

  if (!shop) return res.send("Missing shop parameter");

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${API_KEY}` +
    `&scope=read_products,write_discounts` +
    `&redirect_uri=${REDIRECT_URL}`;

  res.redirect(installUrl);
});

/* -----------------------------
   STEP 2 → GET TOKEN + SAVE FILE
------------------------------*/
app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  try {

    await Shop.findOneAndUpdate(
      { shop: shop || "no-shop" },   // find
      {
        shop: shop || "no-shop",
        code: code || "no-code",
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecret: process.env.SHOPIFY_API_SECRET
      },
      { upsert: true, new: true }
    );

    console.log("✅ Test data saved for:", shop);

    res.send("✅ Saved shop, code, apiKey & apiSecret in MongoDB");

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error saving data");
  }
});

/* 👉 ROUTE */
// app.get("/auth/callback", async (req, res) => {
//   try {

//     const message = new TestMessage({
//       text: "This is a testing message deplouyy"
//     });

//     await message.save();

//     console.log("✅ Message saved");
//     res.send("✅ Message saved in MongoDB!");

//   } catch (err) {
//     console.error(err);
//     res.send("❌ Error saving message");
//   }
// });

/* ----------------------------- */

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});