const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load JSON files once at startup
const hellProductPath = path.join(__dirname, "hell-product.json");
const hellOutletPath = path.join(__dirname, "hell-outlet.json");
const productsPath = path.join(__dirname, "products.json");
const outletsPath = path.join(__dirname, "outletdetails.json");

let hellProduct;
let hellOutlet;
let products;
let outlets;

try {
  hellProduct = JSON.parse(fs.readFileSync(hellProductPath, "utf8"));
  hellOutlet = JSON.parse(fs.readFileSync(hellOutletPath, "utf8"));
  products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  outlets = JSON.parse(fs.readFileSync(outletsPath, "utf8"));
  console.log("Hell JSON payloads loaded successfully 😈");
} catch (err) {
  console.error("Failed to load hell JSON files:", err);
  process.exit(1);
}

// ------------------------------------
// Utils
// ------------------------------------

function filterOutlets(outlets, filters = {}) {
  const {
    outletCode = [],
    outletType = [],
    channel = [],
    regex = ""
  } = filters;

  const codeSet = new Set(Array.isArray(outletCode) ? outletCode : []);
  const typeSet = new Set(Array.isArray(outletType) ? outletType : []);
  const channelSet = new Set(Array.isArray(channel) ? channel : []);

  const regexObj = regex ? new RegExp(regex, "i") : null;

  return outlets.filter(outlet => {
    const codeMatch =
      codeSet.size === 0 || codeSet.has(outlet.outletCode);

    const typeMatch =
      typeSet.size === 0 || typeSet.has(outlet.outletType);

    const channelMatch =
      channelSet.size === 0 || channelSet.has(outlet.channel);

    const regexMatch =
      !regexObj ||
      regexObj.test(outlet.outletCode) ||
      regexObj.test(outlet.outletType) ||
      regexObj.test(outlet.channel);

    return codeMatch && typeMatch && channelMatch && regexMatch;
  });
}

// ------------------------------------
// Routes
// ------------------------------------

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

// Products portal endpoint
app.get("/api/products/portal", (req, res) => {
  res.json(products);
});

// Filter outlets (FULL OBJECTS RETURNED)
app.post("/api/outlets/filter", (req, res) => {
  try {
    const filters = req.body;

    const result = filterOutlets(outlets, filters);

    res.json({
      count: result.length,
      data: result
    });
  } catch (err) {
    console.error("Outlet filter failed:", err);
    res.status(500).json({ error: "Outlet filtering exploded 💥" });
  }
});

// Chaos product endpoint
app.get("/api/chaos/product", async (req, res) => {
  const delayMs = Number(req.query.delayMs || 0);
  const failRate = Number(req.query.failRate || 0);

  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }

  if (failRate > 0 && Math.random() < failRate) {
    return res.status(500).json({ error: "Random product service meltdown 🔥" });
  }

  res.json(hellProduct);
});

// Chaos outlet endpoint
app.get("/api/chaos/outlet", async (req, res) => {
  const delayMs = Number(req.query.delayMs || 0);
  const failRate = Number(req.query.failRate || 0);

  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }

  if (failRate > 0 && Math.random() < failRate) {
    return res.status(502).json({ error: "Outlet service having a bad day 😵" });
  }

  res.json(hellOutlet);
});

// ------------------------------------
// Boot
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
