(function () {
  var SESSION_KEY = "pas_session";

  function setMessage(el, text, kind) {
    if (!el) return;
    el.className = "auth-msg " + (kind || "");
    el.textContent = text;
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString()
    }));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  window.getCurrentSession = getSession;

  window.setupRegisterForm = function setupRegisterForm() {
    var form = document.getElementById("registerForm");
    var message = document.getElementById("message");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var fullName = String(form.name.value || "").trim();
      var email = normalizeEmail(form.email.value);
      var password = String(form.password.value || "");

      if (!fullName || !email || !password) {
        setMessage(message, "Please fill in all fields.", "err");
        return;
      }

      if (password.length < 6) {
        setMessage(message, "Password must be at least 6 characters.", "err");
        return;
      }

      try {
        var response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: fullName, email: email, password: password })
        });

        var data = await response.json();
        if (!response.ok) {
          setMessage(message, data.error || "Registration failed.", "err");
          return;
        }

        setSession(data.user);
        setMessage(message, "Account created. Redirecting to home...", "ok");
        setTimeout(function () { window.location.href = "index.html"; }, 800);
      } catch (error) {
        setMessage(message, "Cannot connect to server. Is it running?", "err");
      }
    });
  };

  window.setupLoginForm = function setupLoginForm() {
    var form = document.getElementById("loginForm");
    var message = document.getElementById("message");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var email = normalizeEmail(form.email.value);
      var password = String(form.password.value || "");

      if (!email || !password) {
        setMessage(message, "Please enter email and password.", "err");
        return;
      }

      try {
        var response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password })
        });

        var data = await response.json();
        if (!response.ok) {
          setMessage(message, data.error || "Login failed.", "err");
          return;
        }

        setSession(data.user);
        setMessage(message, "Logged in successfully. Redirecting...", "ok");
        setTimeout(function () { window.location.href = "index.html"; }, 700);
      } catch (error) {
        setMessage(message, "Cannot connect to server. Is it running?", "err");
      }
    });
  };

  window.applyAuthUi = function applyAuthUi() {
    var session = getSession();

    var navLogin = document.getElementById("nav-login");
    var ctaAccount = document.getElementById("cta-account");
    var navLogout = document.getElementById("nav-logout");
    var welcome = document.getElementById("nav-welcome");

    if (!session) {
      if (navLogin) {
        navLogin.textContent = "Log in";
        navLogin.href = "login.html";
        navLogin.style.display = "inline";
      }
      if (ctaAccount) {
        ctaAccount.textContent = "Get an account";
        ctaAccount.href = "register.html";
      }
      if (navLogout) navLogout.style.display = "none";
      if (welcome) welcome.style.display = "none";
      return;
    }

    if (welcome) {
      welcome.style.display = "inline";
      welcome.textContent = "Hi, " + (session.name || session.email);
    }

    if (navLogin) {
      navLogin.textContent = "My account";
      navLogin.href = "register.html";
      navLogin.style.display = "inline";
    }

    if (ctaAccount) {
      ctaAccount.textContent = "Account created";
      ctaAccount.href = "register.html";
    }

    if (navLogout) {
      navLogout.style.display = "inline";
      navLogout.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem(SESSION_KEY);
        window.location.reload();
      });
    }
  };
})();