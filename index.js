const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config(); // Nạp biến môi trường từ file .env
const cors = require("cors"); // Cài đặt cors

// Khởi tạo môi trường SDK của Firebase
admin.initializeApp({
  credential: admin.credential.cert(require("./config/firebase-adminsdk.json")),
});

const app = express();
app.use(express.json()); // Để đọc dữ liệu JSON từ request body
app.use(cors()); // Sử dụng middleware CORS

const db = admin.firestore();
const collection = db.collection("students"); // Collection students trong Firestore

// Tạo sinh viên mới
app.post("/students", async (req, res) => {
  try {
    const student = req.body;
    if (!student.name || !student.email) {
      return res.status(400).send("Missing required fields: name and email");
    }
    const docRef = await collection.add(student);
    res
      .status(201)
      .send({ id: docRef.id, message: "Student created successfully" });
  } catch (error) {
    res.status(500).send("Error creating student: " + error.message);
  }
});

// Lấy danh sách tất cả sinh viên
app.get("/students", async (req, res) => {
  try {
    const snapshot = await collection.get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
});

// Lấy thông tin chi tiết của một sinh viên
app.get("/students/:id", async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send("Student not found");
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send("Error fetching student: " + error.message);
  }
});

// Cập nhật thông tin của sinh viên
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = req.body;
    if (!updatedStudent.name && !updatedStudent.email) {
      return res
        .status(400)
        .send("At least one field (name or email) must be provided to update");
    }
    await collection.doc(req.params.id).update(updatedStudent);
    res.status(200).send("Student updated successfully");
  } catch (error) {
    res.status(500).send("Error updating student: " + error.message);
  }
});

// Xóa sinh viên
app.delete("/students/:id", async (req, res) => {
  try {
    await collection.doc(req.params.id).delete();
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting student: " + error.message);
  }
});

// Chạy server với port online hoặc 3000 local
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
