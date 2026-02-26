import express from "express";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load env FIRST

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

  if (!shop || !code) return res.send("Missing shop or code");

  try {
    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: API_KEY,
        client_secret: API_SECRET,
        code,
      }
    );

    const accessToken = response.data.access_token;

    /* ---------- SAVE TOKEN IN FILE ---------- */
    const file = "tokens.json";
    let data = {};

    if (fs.existsSync(file)) {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    data[shop] = accessToken;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    console.log("✅ Token saved for:", shop);

    res.send("✅ App installed and token saved!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Error getting token");
  }
});

/* ----------------------------- */

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});