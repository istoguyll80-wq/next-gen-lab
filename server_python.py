import json
import hashlib
import os
import secrets
import sqlite3
import threading
import urllib.request
import urllib.error
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "phishing_simulator.db"
DOTENV_PATH = BASE_DIR / ".env"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def db_connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db_if_needed() -> None:
    # Creates tables + inserts sample data if files exist.
    schema_path = BASE_DIR / "database.sql"
    sample_path = BASE_DIR / "sample_data.sql"

    if not schema_path.exists():
        return

    conn = db_connect()
    try:
        conn.executescript(schema_path.read_text(encoding="utf-8"))
        if sample_path.exists():
            conn.executescript(sample_path.read_text(encoding="utf-8"))
        conn.commit()
    finally:
        conn.close()

def load_env_file_if_present() -> None:
    # Optional convenience: allow GEMINI_API_KEY to be set in a local .env file.
    # This keeps the API key out of frontend code and out of git commits.
    if not DOTENV_PATH.exists():
        return

    try:
        for raw_line in DOTENV_PATH.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
    except Exception:
        # If .env is malformed, ignore it and rely on normal env vars.
        return


def hash_password(password: str) -> str:
    # Beginner-friendly: PBKDF2 built into Python (no external packages).
    # Stored format: pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>
    iterations = 200_000
    salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256${iterations}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iters_s, salt_hex, hash_hex = stored.split("$", 3)
        if algo != "pbkdf2_sha256":
            return False
        iterations = int(iters_s)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return secrets.compare_digest(dk, expected)
    except Exception:
        return False


SYSTEM_INSTRUCTION = (
    "You are a helpful cybersecurity awareness assistant for a Phishing Awareness Simulator website. "
    "You help users understand phishing, scams, suspicious emails, password safety, online security, and how to stay safe. "
    "Keep answers simple, clear, and educational. "
    "Do not help users create phishing attacks, steal accounts, bypass security, write malware, or perform illegal hacking. "
    "If asked for harmful content, refuse politely and explain a safe alternative."
)


def is_disallowed_request(text: str) -> bool:
    # Simple rule-based filter to enforce refusal even before calling Gemini.
    t = (text or "").lower()
    bad_phrases = [
        "write a phishing",
        "create a phishing",
        "phishing email template",
        "steal password",
        "steal credentials",
        "credential harvesting",
        "bypass security",
        "hack account",
        "malware",
        "ransomware",
        "keylogger",
        "ddos",
        "sql injection",
        "xss payload",
        "exploit",
        "crack password",
        "bruteforce",
        "brute force",
        "session hijack",
        "make a scam",
        "social engineering script",
    ]
    return any(p in t for p in bad_phrases)


MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
}


class Handler(BaseHTTPRequestHandler):
    server_version = "PhishingAwarenessPythonServer/1.0"

    def _send_json(self, status: int, obj: dict) -> None:
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return {}

    def _is_api(self) -> bool:
        return self.path.startswith("/api/")

    def do_GET(self):  # noqa: N802
        if self._is_api():
            if self.path == "/api/quiz-types":
                return self._handle_quiz_types()
            if self.path == "/api/chat/health":
                return self._handle_chat_health()
            return self._send_json(404, {"error": "Not found"})

        # Static file serving (same folder as this script)
        url_path = self.path.split("?", 1)[0]
        url_path = unquote(url_path)

        if url_path in ("/", ""):
            url_path = "/index.html"

        # Prevent path traversal
        rel = url_path.lstrip("/")
        target = (BASE_DIR / rel).resolve()
        if BASE_DIR not in target.parents and target != BASE_DIR:
            return self.send_error(403, "Forbidden")

        if not target.exists() or not target.is_file():
            return self.send_error(404, "Not Found")

        content = target.read_bytes()
        mime = MIME_TYPES.get(target.suffix.lower(), "application/octet-stream")
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self):  # noqa: N802
        if not self._is_api():
            return self._send_json(404, {"error": "Not found"})

        if self.path == "/api/register":
            return self._handle_register()
        if self.path == "/api/login":
            return self._handle_login()
        if self.path == "/api/quiz-attempts":
            return self._handle_quiz_attempts()
        if self.path == "/api/contact":
            return self._handle_contact()
        if self.path == "/api/chat":
            return self._handle_chat()

        return self._send_json(404, {"error": "Not found"})

    def _handle_quiz_types(self):
        conn = db_connect()
        try:
            rows = conn.execute("SELECT id, name, description FROM QuizTypes ORDER BY id ASC").fetchall()
            quiz_types = [dict(r) for r in rows]
            return self._send_json(200, {"quizTypes": quiz_types})
        finally:
            conn.close()

    def _handle_chat_health(self):
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        return self._send_json(
            200,
            {
                "ok": True,
                "geminiApiKeySet": bool(api_key),
                "model": "gemini-2.0-flash",
            },
        )

    def _handle_register(self):
        data = self._read_json()
        full_name = str(data.get("fullName", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not full_name or not email or not password:
            return self._send_json(400, {"error": "Please fill in all fields."})
        if len(password) < 6:
            return self._send_json(400, {"error": "Password must be at least 6 characters."})

        conn = db_connect()
        try:
            existing = conn.execute("SELECT id FROM Users WHERE email = ?", (email,)).fetchone()
            if existing:
                return self._send_json(409, {"error": "That email is already registered."})

            pw_hash = hash_password(password)
            cur = conn.execute(
                "INSERT INTO Users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
                (full_name, email, pw_hash, "student", utc_now_iso()),
            )
            conn.commit()

            return self._send_json(
                200,
                {
                    "user": {
                        "id": cur.lastrowid,
                        "fullName": full_name,
                        "email": email,
                        "role": "student",
                    }
                },
            )
        finally:
            conn.close()

    def _handle_login(self):
        data = self._read_json()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not email or not password:
            return self._send_json(400, {"error": "Please enter email and password."})

        conn = db_connect()
        try:
            row = conn.execute(
                "SELECT id, full_name, email, password_hash, role FROM Users WHERE email = ?",
                (email,),
            ).fetchone()
            if not row:
                return self._send_json(401, {"error": "Invalid email or password."})

            if not verify_password(password, row["password_hash"]):
                return self._send_json(401, {"error": "Invalid email or password."})

            return self._send_json(
                200,
                {
                    "user": {
                        "id": row["id"],
                        "fullName": row["full_name"],
                        "email": row["email"],
                        "role": row["role"],
                    }
                },
            )
        finally:
            conn.close()

    def _handle_quiz_attempts(self):
        data = self._read_json()

        try:
            user_id = int(data.get("userId"))
        except Exception:
            user_id = 0

        quiz_type_name = str(data.get("quizTypeName", "")).strip()
        score = data.get("score")
        total_questions = data.get("totalQuestions")
        answers = data.get("answers") if isinstance(data.get("answers"), list) else []

        if not user_id or not quiz_type_name or score is None or total_questions is None:
            return self._send_json(400, {"error": "Missing quiz attempt data."})

        conn = db_connect()
        try:
            quiz_type = conn.execute(
                "SELECT id FROM QuizTypes WHERE lower(name) = lower(?)",
                (quiz_type_name,),
            ).fetchone()
            if not quiz_type:
                return self._send_json(400, {"error": "Invalid quiz type."})

            cur = conn.execute(
                "INSERT INTO QuizAttempts (user_id, quiz_type_id, score, total_questions, created_at) VALUES (?, ?, ?, ?, ?)",
                (user_id, quiz_type["id"], int(score), int(total_questions), utc_now_iso()),
            )
            attempt_id = cur.lastrowid

            for a in answers:
                question_id = a.get("questionId")
                try:
                    question_id = int(question_id) if question_id is not None else None
                except Exception:
                    question_id = None

                question_label = str(a.get("questionLabel", "")).strip() or None
                user_selected = 1 if bool(a.get("userSelectedIsPhishing")) else 0
                correct = 1 if bool(a.get("correctIsPhishing")) else 0
                is_correct = 1 if user_selected == correct else 0

                conn.execute(
                    "INSERT INTO UserAnswers (attempt_id, question_id, question_label, user_selected_is_phishing, correct_is_phishing, is_correct, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (attempt_id, question_id, question_label, user_selected, correct, is_correct, utc_now_iso()),
                )

            conn.commit()
            return self._send_json(200, {"success": True, "attemptId": attempt_id})
        finally:
            conn.close()

    def _handle_contact(self):
        data = self._read_json()
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        message = str(data.get("message", "")).strip()

        if not name or not email or not message:
            return self._send_json(400, {"error": "Please fill in all contact fields."})

        conn = db_connect()
        try:
            conn.execute(
                "INSERT INTO ContactMessages (name, email, message, sent_at) VALUES (?, ?, ?, ?)",
                (name, email, message, utc_now_iso()),
            )
            conn.commit()
            return self._send_json(200, {"success": True})
        finally:
            conn.close()

    def _handle_chat(self):
        data = self._read_json()
        message = str(data.get("message", "")).strip()

        if not message:
            return self._send_json(400, {"error": "Please enter a message."})

        # Refuse harmful requests even before calling Gemini.
        if is_disallowed_request(message):
            return self._send_json(
                200,
                {
                    "reply": (
                        "I can't help with hacking, phishing creation, stealing passwords, bypassing security, malware, "
                        "or other illegal activity. If you want, describe a suspicious email/message you received "
                        "(remove personal info), and I can explain red flags and safe next steps."
                    )
                },
            )

        api_key = os.environ.get("GEMINI_API_KEY", "").strip()

        if not api_key:
            return self._send_json(
                500,
                {
                    "error": (
                        "Gemini API key missing. Set GEMINI_API_KEY and restart the server. "
                        "You can also create a .env file next to server_python.py with: GEMINI_API_KEY=your_key"
                    )
                },
            )

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        payload = {
            # System instruction field name follows Gemini REST docs.
            "system_instruction": {
                "parts": [
                    {
                        "text": SYSTEM_INSTRUCTION
                    }
                ]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": message}],
                }
            ],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 512},
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "x-goog-api-key": api_key,
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            try:
                details = e.read().decode("utf-8")
            except Exception:
                details = str(e)
            return self._send_json(502, {"error": "Gemini API error: " + details})
        except Exception:
            return self._send_json(502, {"error": "Could not reach Gemini API."})

        try:
            data = json.loads(raw)
            reply = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
            )
            reply = str(reply).strip()
        except Exception:
            reply = ""

        if not reply:
            return self._send_json(502, {"error": "Gemini returned no text."})

        return self._send_json(200, {"reply": reply})

    def log_message(self, format, *args):  # noqa: A002
        # Keep console output short.
        msg = format % args
        print(f"[{utc_now_iso()}] {self.client_address[0]} {self.command} {self.path} -> {msg}")


def main() -> None:
    load_env_file_if_present()
    init_db_if_needed()
    server = ThreadingHTTPServer(("127.0.0.1", 3000), Handler)
    print("Running on http://localhost:3000 (Python server)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
