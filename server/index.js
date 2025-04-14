// server/index.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Allow JSON payloads for our custom endpoints
app.use(express.json());

// Enhanced CORS configuration
app.use(cors());

// Ensure uploads directory exists with proper permissions
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
}

// ---------- Existing File Upload Endpoints ----------

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Endpoint for file uploads (if needed)
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// Serve static files for direct access
app.use(
  "/files",
  express.static(uploadDir, {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

// List files in the uploads directory
app.get("/files-list", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to scan files" });
    // Only list payload files (filter out metadata files)
    const filtered = files.filter((f) => !f.endsWith(".json"));
    res.json(filtered);
  });
});

// ---------- New Endpoints for MIME Sniffing Demo ----------

// POST /save-payload: Save payload with header options
app.post("/save-payload", (req, res) => {
  const { payload, contentType, noSniff, extension, filename } = req.body;
  if (typeof payload !== "string" || !extension) {
    return res
      .status(400)
      .json({ error: "Payload and extension are required" });
  }

  // Create a unique filename or use the provided one
  const timestamp = Date.now();
  const finalFilename =
    filename && filename.trim() !== "" ? filename : `${timestamp}`;
  const fullFilename = `${finalFilename}.${extension}`;
  const filepath = path.join(uploadDir, fullFilename);

  // Save the payload to a file
  fs.writeFile(filepath, payload, (err) => {
    if (err) {
      console.error("Error writing payload file:", err);
      return res.status(500).json({ error: "Error saving payload" });
    }

    // Save metadata (contentType and noSniff) as a companion JSON file
    const meta = { contentType, noSniff };
    const metaFile = filepath + ".json";
    fs.writeFile(metaFile, JSON.stringify(meta), (metaErr) => {
      if (metaErr) {
        console.error("Error writing metadata file:", metaErr);
      }
      return res.json({ message: "Payload saved", filename: fullFilename });
    });
  });
});

const sendFileWithoutType = (res, filePath) => {
  const fileStream = fs.createReadStream(filePath);
  res.removeHeader("Content-Type");
  fileStream.pipe(res);
  fileStream.on("error", () => res.status(404).send("File not found"));
};

// GET /serve/:filename: Serve the payload with custom headers based on metadata
app.get("/serve/:filename", (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(uploadDir, filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).send("File not found");
  }

  // Try to read metadata
  const metaFile = filepath + ".json";
  if (fs.existsSync(metaFile)) {
    try {
      const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

      // Handle nosniff option
      if (metaData.noSniff) {
        res.set("X-Content-Type-Options", "nosniff");
      }

      // Handle Content-Type configuration
      if (metaData.contentType) {
        res.set("Content-Type", metaData.contentType);
        if (metaData.contentType === "omit") {
          sendFileWithoutType(res, filepath);
          return;
        }
      }
    } catch (e) {
      console.error("Error parsing metadata:", e);
    }
  }

  res.sendFile(filepath);
});

app.get("/health-check", (req, res) => {
  res.send("Server is running!");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadDir}`);
});
