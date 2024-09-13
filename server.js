// backend/server.js
const express = require("express");
const app = express();
const port = 3001;

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Định nghĩa một route cơ bản
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Lắng nghe trên cổng đã chỉ định
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
