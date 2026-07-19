document.addEventListener("DOMContentLoaded", () => {
  const ACCOUNT_KEY = "cmonthreadAccount";
  const SESSION_KEY = "cmonthreadSession";

  const messageBox = document.getElementById("authMessage");

  function setMessage(text, type = "") {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `auth-message ${type}`.trim();
  }

  function getSavedAccount() {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNT_KEY));
    } catch {
      return null;
    }
  }

  function saveAccount(account) {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }

  function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;

      const account = getSavedAccount();

      if (!account) {
        setMessage("No account found. Please create one first.", "error");
        return;
      }

      if (email === account.email.toLowerCase() && password === account.password) {
        saveSession({
          name: account.name,
          email: account.email
        });

        setMessage("Login successful. Redirecting...", "success");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 900);
      } else {
        setMessage("Incorrect email or password.", "error");
      }
    });
  }

  const createAccountForm = document.getElementById("createAccountForm");
  if (createAccountForm) {
    createAccountForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      if (name.length < 2) {
        setMessage("Please enter a valid name.", "error");
        return;
      }

      const account = {
        name,
        email,
        password
      };

      saveAccount(account);
      saveSession({
        name: account.name,
        email: account.email
      });

      setMessage("Account created successfully. Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }

  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
      const account = getSavedAccount();

      if (!account) {
        setMessage("No saved account found yet.", "error");
        return;
      }

      if (email !== account.email.toLowerCase()) {
        setMessage("Email not found in the saved account.", "error");
        return;
      }

      setMessage("Reset link sent to your email address. (Prototype only)", "success");
    });
  }
});