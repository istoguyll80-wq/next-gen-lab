const fs = require("fs");
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "phishing_simulator.db");

app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database(DB_PATH);

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, "database.sql"), "utf8");
  const sample = fs.readFileSync(path.join(__dirname, "sample_data.sql"), "utf8");

  await runSql("PRAGMA foreign_keys = ON");
  await new Promise((resolve, reject) => {
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });
  await new Promise((resolve, reject) => {
    db.exec(sample, (err) => (err ? reject(err) : resolve()));
  });
}

app.post("/api/register", async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await getSql("SELECT id FROM Users WHERE email = ?", [email]);
    if (existing) {
      return res.status(409).json({ error: "That email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await runSql(
      "INSERT INTO Users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [fullName, email, passwordHash, "student"]
    );

    return res.json({
      user: {
        id: result.lastID,
        fullName,
        email,
        role: "student"
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error during registration." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password." });
    }

    const user = await getSql("SELECT id, full_name, email, password_hash, role FROM Users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error during login." });
  }
});

app.get("/api/quiz-types", async (req, res) => {
  try {
    const rows = await allSql("SELECT id, name, description FROM QuizTypes ORDER BY id ASC");
    return res.json({ quizTypes: rows });
  } catch (error) {
    return res.status(500).json({ error: "Could not load quiz types." });
  }
});

app.post("/api/quiz-attempts", async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    const quizTypeName = String(req.body.quizTypeName || "").trim();
    const score = Number(req.body.score);
    const totalQuestions = Number(req.body.totalQuestions);
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];

    if (!userId || !quizTypeName || Number.isNaN(score) || Number.isNaN(totalQuestions)) {
      return res.status(400).json({ error: "Missing quiz attempt data." });
    }

    const quizType = await getSql("SELECT id FROM QuizTypes WHERE lower(name) = lower(?)", [quizTypeName]);
    if (!quizType) {
      return res.status(400).json({ error: "Invalid quiz type." });
    }

    const attemptResult = await runSql(
      "INSERT INTO QuizAttempts (user_id, quiz_type_id, score, total_questions) VALUES (?, ?, ?, ?)",
      [userId, quizType.id, score, totalQuestions]
    );

    const attemptId = attemptResult.lastID;

    for (const answer of answers) {
      const userSelected = answer.userSelectedIsPhishing ? 1 : 0;
      const correct = answer.correctIsPhishing ? 1 : 0;
      const isCorrect = userSelected === correct ? 1 : 0;
      const questionId = answer.questionId ? Number(answer.questionId) : null;
      const questionLabel = String(answer.questionLabel || "").trim();

      await runSql(
        "INSERT INTO UserAnswers (attempt_id, question_id, question_label, user_selected_is_phishing, correct_is_phishing, is_correct) VALUES (?, ?, ?, ?, ?, ?)",
        [attemptId, questionId, questionLabel || null, userSelected, correct, isCorrect]
      );
    }

    return res.json({ success: true, attemptId });
  } catch (error) {
    return res.status(500).json({ error: "Could not save quiz attempt." });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill in all contact fields." });
    }

    await runSql(
      "INSERT INTO ContactMessages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not send message." });
  }
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database init failed:", error);
  });