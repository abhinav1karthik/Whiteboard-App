const Canvas = require("../models/canvasModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.createCanvas = async (req, res) => {
  try {
    const userId = req.userId;

    const newCanvas = new Canvas({
      owner: userId,
      shared: [],
      elements: [],
    });

    await newCanvas.save();
    res.status(201).json({
      message: "Canvas created successfully",
      canvasId: newCanvas._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create canvas", details: error.message });
  }
};
exports.loadCanvas = async (req, res) => {
  try {
    const canvasId = req.params.id;
    const userId = req.userId;

    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(404).json({ error: "Canvas not found" });
    }

    // Ensure only the owner or shared users can access it
    if (canvas.owner.toString() !== userId && !canvas.shared.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to access this canvas" });
    }

    res.json(canvas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load canvas", details: error.message });
  }
};
exports.updateCanvas = async (req, res) => {
  try {
    const { canvasId, elements } = req.body;
    const userId = req.userId;
    console.log("canvas id ", canvasId);

    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(404).json({ error: "Canvas not found" });
    }

    // Ensure only the owner or shared users can update
    if (canvas.owner.toString() !== userId && !canvas.shared.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this canvas" });
    }

    canvas.elements = elements;
    await canvas.save();

    console.log("saved");

    res.json({ message: "Canvas updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update canvas", details: error.message });
  }
};
