PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS QuizTypes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_type_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  correct_is_phishing INTEGER NOT NULL CHECK (correct_is_phishing IN (0,1)),
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_type_id) REFERENCES QuizTypes(id)
);

CREATE TABLE IF NOT EXISTS QuizAttempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quiz_type_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (quiz_type_id) REFERENCES QuizTypes(id)
);

CREATE TABLE IF NOT EXISTS UserAnswers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL,
  question_id INTEGER,
  question_label TEXT,
  user_selected_is_phishing INTEGER NOT NULL CHECK (user_selected_is_phishing IN (0,1)),
  correct_is_phishing INTEGER NOT NULL CHECK (correct_is_phishing IN (0,1)),
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (attempt_id) REFERENCES QuizAttempts(id),
  FOREIGN KEY (question_id) REFERENCES Questions(id)
);

CREATE TABLE IF NOT EXISTS ContactMessages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);