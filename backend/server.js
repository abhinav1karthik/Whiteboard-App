const express = require("express");
const connectToDatabase = require("./db");

const app = express();

connectToDatabase();

app.get("/", (req, res) => {
  res.send("API is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
