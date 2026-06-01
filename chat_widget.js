// Floating AI Chat widget (Gemini 2.0 via backend).
// This file does NOT contain any API keys. It only calls our backend endpoint: POST /api/chat
(function () {
  var ENABLE_KEY = "pas_chat_enabled";
  var HISTORY_KEY = "pas_chat_history";

  function isEnabled() {
    try { return localStorage.getItem(ENABLE_KEY) === "1"; } catch (e) { return false; }
  }

  function enable() {
    try { localStorage.setItem(ENABLE_KEY, "1"); } catch (e) {}
  }

  // If user opened chat.html directly, enable the widget for next pages too.
  if (String(window.location.pathname || "").toLowerCase().endsWith("/chat.html")) {
    enable();
  }

  if (!isEnabled()) return; // User must choose AI Chat option first.

  function loadHistory() {
    try { return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) { return []; }
  }

  function saveHistory(items) {
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(items)); } catch (e) {}
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (children && children.length) children.forEach(function (c) { node.appendChild(c); });
    return node;
  }

  // Styles (kept self-contained to avoid touching your existing CSS).
  var style = el("style", { text: "" });
  style.textContent = [
    ".pas-chat-btn{position:fixed;right:16px;bottom:16px;z-index:9999;width:54px;height:54px;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:linear-gradient(180deg, rgba(45,212,191,.20), rgba(45,212,191,.10));color:#e6eef8;display:grid;place-items:center;cursor:pointer;box-shadow:0 16px 40px rgba(2,6,23,.55)}",
    ".pas-chat-btn:focus{outline:2px solid rgba(125,211,252,.6);outline-offset:3px}",
    ".pas-chat-panel{position:fixed;right:16px;bottom:84px;z-index:9999;width:min(380px, calc(100vw - 32px));max-height:min(520px, calc(100vh - 120px));display:none;flex-direction:column;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg, rgba(11,18,32,.98), rgba(7,16,35,.98));box-shadow:0 18px 60px rgba(2,6,23,.70)}",
    ".pas-chat-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px;border-bottom:1px solid rgba(255,255,255,.06)}",
    ".pas-chat-title{font-weight:800;font-size:13px;letter-spacing:.2px}",
    ".pas-chat-sub{color:var(--muted,#94a3b8);font-size:12px;margin-top:2px}",
    ".pas-chat-x{appearance:none;border:0;background:transparent;color:#cbd5e1;cursor:pointer;padding:6px 8px;border-radius:10px}",
    ".pas-chat-x:hover{background:rgba(255,255,255,.05)}",
    ".pas-chat-log{padding:12px;display:flex;flex-direction:column;gap:10px;overflow:auto}",
    ".pas-chat-msg{border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px;background:rgba(255,255,255,.02)}",
    ".pas-chat-msg.you{border-color:rgba(45,212,191,.22)}",
    ".pas-chat-msg.ai{border-color:rgba(251,191,36,.20)}",
    ".pas-chat-meta{font-size:12px;color:var(--muted,#94a3b8);margin-bottom:5px}",
    ".pas-chat-text{white-space:pre-wrap;line-height:1.45;font-size:13px}",
    ".pas-chat-foot{display:grid;grid-template-columns:1fr auto;gap:10px;padding:12px;border-top:1px solid rgba(255,255,255,.06)}",
    ".pas-chat-input{width:100%;min-height:42px;max-height:120px;resize:vertical;padding:10px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:#091326;color:#e6eef8}",
    ".pas-chat-send{padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:linear-gradient(180deg, rgba(125,211,252,.25), rgba(125,211,252,.10));color:#e6eef8;cursor:pointer;font-weight:700}",
    ".pas-chat-send:disabled{opacity:.6;cursor:not-allowed}",
    "@media (max-width:520px){.pas-chat-panel{right:12px;left:12px;width:auto}.pas-chat-btn{right:12px;bottom:12px}}"
  ].join("");
  document.head.appendChild(style);

  // DOM
  var chatBtn = el("button", { class: "pas-chat-btn", type: "button", title: "AI Chat", "aria-label": "Open AI Chat" }, [
    el("span", { text: "AI" })
  ]);

  var panel = el("div", { class: "pas-chat-panel", role: "dialog", "aria-modal": "false", "aria-label": "AI Chat window" });
  var head = el("div", { class: "pas-chat-head" });
  var headLeft = el("div", null, [
    el("div", { class: "pas-chat-title", text: "AI Helper (Gemini 2.0)" }),
    el("div", { class: "pas-chat-sub", text: "Phishing and online safety questions" })
  ]);
  var closeBtn = el("button", { class: "pas-chat-x", type: "button", "aria-label": "Close chat", text: "Close" });
  head.appendChild(headLeft);
  head.appendChild(closeBtn);

  var log = el("div", { class: "pas-chat-log", id: "pasChatLog" });
  var foot = el("form", { class: "pas-chat-foot", id: "pasChatForm" });
  var input = el("textarea", { class: "pas-chat-input", name: "prompt", placeholder: "Ask a question...", required: "true" });
  var send = el("button", { class: "pas-chat-send", type: "submit", text: "Send" });
  foot.appendChild(input);
  foot.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(foot);

  document.body.appendChild(panel);
  document.body.appendChild(chatBtn);

  function addMsg(role, text) {
    var wrap = el("div", { class: "pas-chat-msg " + (role === "you" ? "you" : "ai") });
    wrap.appendChild(el("div", { class: "pas-chat-meta", text: role === "you" ? "You" : "AI" }));
    wrap.appendChild(el("div", { class: "pas-chat-text", text: text }));
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  // Restore history for this tab/session.
  var history = loadHistory();
  if (!history.length) {
    history = [{ role: "ai", text: "Hi. Ask me anything about phishing, suspicious emails, or safe steps to take." }];
    saveHistory(history);
  }
  history.forEach(function (m) { addMsg(m.role, m.text); });

  function setOpen(open) {
    panel.style.display = open ? "flex" : "none";
    if (open) {
      input.focus();
    }
  }

  chatBtn.addEventListener("click", function () {
    setOpen(panel.style.display !== "flex");
  });
  closeBtn.addEventListener("click", function () {
    setOpen(false);
  });

  foot.addEventListener("submit", async function (event) {
    event.preventDefault();
    var text = String(input.value || "").trim();
    if (!text) return;

    addMsg("you", text);
    history.push({ role: "you", text: text });
    saveHistory(history);

    input.value = "";
    send.disabled = true;
    var thinkingText = "Thinking...";
    addMsg("ai", thinkingText);
    var thinkingIndex = history.length; // index where AI message will be saved

    try {
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      var data = await resp.json();
      var reply = resp.ok ? (data.reply || "") : (data.error || "Chat failed.");
      reply = String(reply || "").trim() || "No response.";

      // Replace the last "Thinking..." bubble.
      log.removeChild(log.lastChild);
      addMsg("ai", reply);
      history.push({ role: "ai", text: reply });
      saveHistory(history);
    } catch (e) {
      log.removeChild(log.lastChild);
      var errText = "Cannot connect to server. Is localhost running?";
      addMsg("ai", errText);
      history.push({ role: "ai", text: errText });
      saveHistory(history);
    } finally {
      send.disabled = false;
    }
  });
})();

