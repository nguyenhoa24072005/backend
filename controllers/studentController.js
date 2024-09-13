const admin = require("firebase-admin");
const db = admin.firestore();

exports.createStudent = async (req, res) => {
  try {
    const student = req.body;
    const docRef = await db.collection("students").add(student);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = [];
    const snapshot = await db.collection("students").get();
    snapshot.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("students").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student", error });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = req.body;
    await db.collection("students").doc(id).set(student, { merge: true });
    res.status(200).json({ message: "Student updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("students").doc(id).delete();
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error });
  }
};
