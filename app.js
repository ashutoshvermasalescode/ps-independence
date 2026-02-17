const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ------------------------------------
// Load JSON files once at startup
// ------------------------------------

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
  console.error("Failed to load JSON files:", err);
  process.exit(1);
}

// ------------------------------------
// Utils
// ------------------------------------

function filterOutlets(outlets, { outletCode = [], regex = "" } = {}) {
  const codeSet = new Set(
    Array.isArray(outletCode)
      ? outletCode
      : outletCode
      ? [outletCode]
      : []
  );

  const regexObj = regex ? new RegExp(regex, "i") : null;

  return outlets.filter(outlet => {
    const codeMatch =
      codeSet.size === 0 || codeSet.has(outlet.outletCode);

    const regexMatch =
      !regexObj || regexObj.test(outlet.outletCode);

    return codeMatch && regexMatch;
  });
}

// ------------------------------------
// Routes
// ------------------------------------

app.get("/", (req, res) => {
  res.send("Mock API server is up and serving cursed JSON 🚀");
});

// ------------------------------------
// Core APIs
// ------------------------------------

app.get("/api/product/hell", (req, res) => {
  res.json(hellProduct);
});

app.get("/api/outlet/hell", (req, res) => {
  res.json(hellOutlet);
});

app.get("/api/products/portal", (req, res) => {
  res.json(products);
});

// ------------------------------------
// FILTER (Regex applied on outletCode)
// ------------------------------------

app.post("/api/outlets/filter", (req, res) => {
  try {
    const { regex = "" } = req.body;

    const regexObj = regex ? new RegExp(regex, "i") : null;

    const filteredCodes = outlets
      .filter(outlet => {
        if (!regexObj) return true;

        return (
          regexObj.test(outlet.outletCode) ||
          regexObj.test(outlet.outletType) ||
          regexObj.test(outlet.channel)
        );
      })
      .map(outlet => outlet.outletCode)
      .filter(Boolean);

    res.json({
      outletCode: filteredCodes
    });

  } catch (err) {
    console.error("Outlet filter failed:", err);
    res.status(500).json({ error: "Outlet filtering exploded 💥" });
  }
});

// ------------------------------------
// Fetch ALL outletTypes (canonical)
// ------------------------------------

app.get("/api/outlets/outletType", (req, res) => {
  const response = outlets.map(o => ({
    outletType: o.outletType
  }));
  res.json(response);
});

// ------------------------------------
// Fetch ALL channels (canonical)
// ------------------------------------

app.get("/api/outlets/channel", (req, res) => {
  const response = outlets.map(o => ({
    channel: o.channel
  }));
  res.json(response);
});

// ------------------------------------
// Boot
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
