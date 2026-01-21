// ===== CART PAGE LOGIC =====

function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  if (!cartItemsEl || !cartTotalEl) return;

  const cart = getCart();

  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div style="text-align:center; padding:2rem; color:#6b7280;">
        <p style="font-size:1.1rem;">Your cart is empty 🛒</p>
        <p style="margin-top:0.5rem;">
          <a href="index.html" style="color:#16a34a;">Start shopping →</a>
        </p>
      </div>
    `;

    cartTotalEl.textContent = "0";
    return;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <span class="badge badge-gray">${item.unit}</span>
      <h3>${item.name}</h3>

      <div class="card-actions">
        <div>
          <button class="btn btn-outline qty-minus">−</button>
          <span style="margin: 0 0.5rem;">${item.quantity}</span>
          <button class="btn btn-outline qty-plus">+</button>
        </div>

        <div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <button class="btn btn-outline remove-btn" style="margin-left: 0.5rem;">Remove</button>
        </div>
      </div>
    `;

    // Quantity minus
    card.querySelector(".qty-minus").addEventListener("click", () => {
      updateQuantity(item.id, item.quantity - 1);
    });

    // Quantity plus
    card.querySelector(".qty-plus").addEventListener("click", () => {
      updateQuantity(item.id, item.quantity + 1);
    });

    // Remove item
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItemsEl.appendChild(card);
  });

  cartTotalEl.textContent = total;
}

// ===== CART HELPERS =====

function updateQuantity(productId, newQty) {
  let cart = getCart();

  cart = cart.map(item => {
    if (item.id === productId) {
      return { ...item, quantity: Math.max(newQty, 1) };
    }
    return item;
  });

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);

  saveCart(cart);
  renderCart();
  updateCartCount();
}

// Render cart on page load
// renderCart();
// updateCartCount();

// ===== PLACE ORDER LOGIC =====

function placeOrder() {
  // 1️⃣ Must be logged in
  const user = getLoggedInUser();
  if (!user) {
    alert("Please login to place an order.");
    window.location.href = "login.html";
    return;
  }

  // 2️⃣ Cart must not be empty
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // 3️⃣ Calculate total
  let totalAmount = 0;
  cart.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  // 4️⃣ Create order object
  const order = {
    id: Date.now(),
    userEmail: user.email,
    items: cart,
    totalAmount,
    orderDate: new Date().toISOString().split("T")[0],
    status: "PLACED"
  };

  // 5️⃣ Save order
  const existingOrders =
    JSON.parse(localStorage.getItem("grabitgreen_orders")) || [];

  existingOrders.push(order);
  localStorage.setItem(
    "grabitgreen_orders",
    JSON.stringify(existingOrders)
  );

  // 6️⃣ Clear cart
  localStorage.removeItem("grabitgreen_cart");
  updateCartCount();

  // 7️⃣ Redirect
  alert("Order placed successfully!");
  window.location.href = "orders.html";
}

// ===== FREQUENTLY ORDERED TOGETHER =====

function getRecommendations() {
  const user = getLoggedInUser();
  if (!user) return [];

  const cart = getCart();
  if (cart.length === 0) return [];

  const orders =
    JSON.parse(localStorage.getItem("grabitgreen_orders")) || [];

  // Only user's past orders
  const userOrders = orders.filter(
    order => order.userEmail === user.email
  );

  const pairCount = {};

  // Build pair frequency map
  userOrders.forEach(order => {
    const items = order.items.map(i => i.id);

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (i !== j) {
          const key = `${items[i]}_${items[j]}`;
          pairCount[key] = (pairCount[key] || 0) + 1;
        }
      }
    }
  });

  const cartItemIds = cart.map(item => item.id);
  const recommendations = [];

  Object.keys(pairCount).forEach(pair => {
    const [itemA, itemB] = pair.split("_").map(Number);

    if (
      cartItemIds.includes(itemA) &&
      !cartItemIds.includes(itemB)
    ) {
      recommendations.push({
        itemId: itemB,
        score: pairCount[pair]
      });
    }
  });

  // Sort by frequency
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

function renderRecommendations() {
  const recEl = document.getElementById("recommendations");
  if (!recEl) return;

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    recEl.innerHTML = "";
    return;
  }

  // For demo: show top recommendation only
  const topRec = recommendations[0];

  // Find product details from backend-loaded products (fallback static)
  const allProducts = JSON.parse(localStorage.getItem("grabitgreen_all_products")) || [];

  const product = allProducts.find(p => p.id === topRec.itemId);
  if (!product) return;

  recEl.innerHTML = `
    <div style="
      background:#ecfdf5;
      border:1px solid #bbf7d0;
      border-radius:12px;
      padding:1rem;
      max-width:320px;
    ">
      <h4 style="margin-bottom:0.5rem;">
        You may also need 🧠
      </h4>

      <p style="font-size:0.85rem; color:#065f46; margin-bottom:0.8rem;">
        Based on your previous orders
      </p>

      <div class="product-card">
        <h4>${product.name}</h4>
        <p>${product.unit}</p>
        <strong>${formatPrice(product.price)}</strong>
        <div style="margin-top:0.5rem;">
          <button class="btn btn-primary" id="add-rec-btn">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `;


  document
    .getElementById("add-rec-btn")
    .addEventListener("click", () => {
      addToCart(product);
      renderCart();
      renderRecommendations();
    });
}

// Render cart on page load
renderCart();
updateCartCount();
renderRecommendations();

