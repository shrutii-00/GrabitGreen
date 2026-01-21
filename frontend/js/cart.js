// ===== CART UTILITIES =====

const CART_KEY = "grabitgreen_cart";

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

// Get total cart count (for later navbar badge)
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count in navbar
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  countEl.textContent = getCartItemCount();
}
