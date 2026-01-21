// Global app configuration

const API_BASE_URL = "http://localhost:8080/api";

// Utility: format price
function formatPrice(value) {
  return `₹${value}`;
}

// ===== AUTH SESSION HELPERS =====

function getLoggedInUser() {
  const user = localStorage.getItem("grabitgreen_logged_in_user");
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getLoggedInUser();
}

function logout() {
  localStorage.removeItem("grabitgreen_logged_in_user");
  window.location.href = "login.html";
}
