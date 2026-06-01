# How to run the SQLite database + website

## 1) Install Node.js
Install Node.js (LTS) from [https://nodejs.org](https://nodejs.org).
This gives you `node` and `npm` commands.

## 2) Open project folder
Open terminal in:
`C:\Users\istog\Desktop\Phishing Awareness Simulator`

## 3) Install dependencies
Run:
`npm install`

## 4) Create/initialize database
Run:
`npm run init-db`

This creates/updates:
- `phishing_simulator.db`
- Tables from `database.sql`
- Sample quiz data from `sample_data.sql`

## 5) Start backend + frontend server
Run:
`npm start`

Server runs at:
`http://localhost:3000`

Open in browser:
[http://localhost:3000/index.html](http://localhost:3000/index.html)

## Alternative (no npm): Python server
If you cannot use `npm`, you can run a simple Python localhost server included in this project:

Run:
`python server_python.py`

Then open:
[http://localhost:3000/index.html](http://localhost:3000/index.html)

To stop it: press `Ctrl + C` in the terminal.

## Gemini 2.0 AI Chat (API key)
The AI Chat page calls Gemini 2.0 through the Gemini API. You must set an API key before it will work:

Windows PowerShell:
`$env:GEMINI_API_KEY="YOUR_KEY_HERE"`

Then start the server again.

Alternative (recommended for beginners): create a file named `.env` in the same folder as `server_python.py`:
`GEMINI_API_KEY=YOUR_KEY_HERE`

Quick check:
Open `http://localhost:3000/api/chat/health` and confirm `geminiApiKeySet` is `true`.

## Using the floating chat widget
The floating chat widget is hidden until the user enables it:
- Go to `choose_quiz.html`
- Click `AI Chat`

After that, the floating `AI` button appears on pages during your browser session.

## 6) What is now stored in database
- Register: saved to `Users`
- Login: checked from `Users`
- Quiz finish (Email/Steam): saved to `QuizAttempts`
- Each quiz answer: saved to `UserAnswers`
- Contact form submit: saved to `ContactMessages`

## Notes
- Keep using `http://localhost:3000` (not opening HTML files directly), because API calls need the server.
- Passwords are stored securely as hashes (`bcryptjs`) in `Users.password_hash`.
