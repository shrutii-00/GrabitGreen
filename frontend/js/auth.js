// ===== AUTH LOGIC =====

// Save user to localStorage
function saveUser(user) {
  localStorage.setItem("grabitgreen_user", JSON.stringify(user));
}

// Handle signup
function handleSignup(event) {
  event.preventDefault(); // page reload stop

  const nameInput = document.querySelector("#signup-form input[type='text']");
  const emailInput = document.querySelector("#signup-form input[type='email']");
  const passwordInput = document.querySelector("#signup-form input[type='password']");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const user = {
    name,
    email
    // password intentionally not stored (portfolio-safe)
  };

  saveUser(user);

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

// Get saved user
function getSavedUser() {
  const user = localStorage.getItem("grabitgreen_user");
  return user ? JSON.parse(user) : null;
}

// Save logged-in session
function setLoggedInUser(user) {
  localStorage.setItem("grabitgreen_logged_in_user", JSON.stringify(user));
}

// Handle login
function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.querySelector("#login-form input[type='email']");
  const passwordInput = document.querySelector("#login-form input[type='password']");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const savedUser = getSavedUser();

  if (!savedUser) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (email !== savedUser.email) {
    alert("Invalid email. Please try again.");
    return;
  }

  // Password check skipped intentionally (portfolio-safe)

  setLoggedInUser(savedUser);

  alert(`Welcome back, ${savedUser.name}!`);
  window.location.href = "index.html";
}
