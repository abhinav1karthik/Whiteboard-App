const express = require("express");
const {
  createCanvas,
  loadCanvas,
  getUserCanvases,
  updateCanvas,
} = require("../controllers/canvasController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createCanvas);
router.get("/:id", authMiddleware, loadCanvas);
router.put("/update", authMiddleware, updateCanvas);
module.exports = router;
