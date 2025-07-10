const Canvas = require("../models/canvasModel");

exports.getUserCanvases = async (req, res) => {
  try {
    const userId = req.userId;

    const canvases = await Canvas.find({
      $or: [{ owner: userId }, { shared: userId }],
    }).sort({ createdAt: -1 });

    res.json(canvases);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch canvases", details: error.message });
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

exports.createCanvas = async (req, res) => {
  try {
    const userId = req.userId;

    const newCanvas = new Canvas({
      owner: userId,
      shared: [],
      elements: [],
    });

    await newCanvas.save();
    res
      .status(201)
      .json({
        message: "Canvas created successfully",
        canvasId: newCanvas._id,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create canvas", details: error.message });
  }
};
