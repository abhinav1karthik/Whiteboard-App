const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  loadCanvas,
  getUserCanvases,
  createCanvas,
} = require("../controllers/canvasController");
const router = express.Router();
router.get("/list", authMiddleware, getUserCanvases);
router.get("/load/:id", authMiddleware, loadCanvas);
router.post("/create", authMiddleware, createCanvas);

module.exports = router;
