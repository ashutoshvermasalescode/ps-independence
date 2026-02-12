const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load JSON files once at startup
const hellProductPath = path.join(__dirname, /*"data",*/ "hell-product.json");
const hellOutletPath = path.join(__dirname, /*"data",*/ "hell-outlet.json");

let hellProduct;
let hellOutlet;

try {
  hellProduct = JSON.parse(fs.readFileSync(hellProductPath, "utf8"));
  hellOutlet = JSON.parse(fs.readFileSync(hellOutletPath, "utf8"));
  console.log("Hell JSON payloads loaded successfully 😈");
} catch (err) {
  console.error("Failed to load hell JSON files:", err);
  process.exit(1); // fail fast if files are broken
}

// Health check
app.get("/", (req, res) => {
  res.send("Mock API server is up and serving cursed JSON 🚀");
});

// Product hell endpoint
app.get("/api/product/hell", (req, res) => {
  res.json(hellProduct);
});

// Outlet hell endpoint
app.get("/api/outlet/hell", (req, res) => {
  res.json(hellOutlet);
});

// Optional chaos mode toggle via query param
app.get("/api/chaos/product", async (req, res) => {
  const delayMs = Number(req.query.delayMs || 0);
  const failRate = Number(req.query.failRate || 0); // 0.0 - 1.0

  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }

  if (failRate > 0 && Math.random() < failRate) {
    return res.status(500).json({ error: "Random product service meltdown 🔥" });
  }

  res.json(hellProduct);
});

app.get("/api/chaos/outlet", async (req, res) => {
  const delayMs = Number(req.query.delayMs || 0);
  const failRate = Number(req.query.failRate || 0); // 0.0 - 1.0

  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }

  if (failRate > 0 && Math.random() < failRate) {
    return res.status(502).json({ error: "Outlet service having a bad day 😵" });
  }

  res.json(hellOutlet);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
