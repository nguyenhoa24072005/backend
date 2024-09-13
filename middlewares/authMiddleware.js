const express = require("express");
const app = express();

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

// Middleware để ghi nhật ký thông tin về mỗi yêu cầu
app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next(); // Tiếp tục đến middleware hoặc route handler tiếp theo
});

// Route handler
app.get("/students", (req, res) => {
  // Xử lý yêu cầu GET đến /students
  res.send("List of students");
});

// Middleware để xử lý lỗi 404 (không tìm thấy)
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Middleware để xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Chạy server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
