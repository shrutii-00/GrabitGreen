// Protect orders page
if (!isLoggedIn()) {
  alert("Please login to view your orders.");
  window.location.href = "login.html";
}

// ===== RENDER ORDERS =====

function renderOrders() {
  const ordersListEl = document.getElementById("orders-list");
  if (!ordersListEl) return;

  const user = getLoggedInUser();
  const allOrders =
    JSON.parse(localStorage.getItem("grabitgreen_orders")) || [];

  // Filter only current user's orders
  const userOrders = allOrders.filter(
    order => order.userEmail === user.email
  );

  if (userOrders.length === 0) {
    ordersListEl.innerHTML =
      "<p>You have not placed any orders yet 📦</p>";
    return;
  }

  ordersListEl.innerHTML = "";

  userOrders.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";
    orderCard.style.marginBottom = "1.5rem";

    let itemsHtml = "";
    order.items.forEach(item => {
      itemsHtml += `
        <li>
          ${item.name} × ${item.quantity}
          (${formatPrice(item.price * item.quantity)})
        </li>
      `;
    });

    orderCard.innerHTML = `
      <h3>Order #${order.id}</h3>
      <p><strong>Date:</strong> ${order.orderDate}</p>
      <p>
          <span style="
            background:#dcfce7;
            color:#166534;
            padding:0.2rem 0.6rem;
            border-radius:999px;
            font-size:0.75rem;
          ">
            ${order.status}
          </span>
      </p>


      <ul style="margin: 0.5rem 0;">
        ${itemsHtml}
      </ul>

      <strong>Total: ${formatPrice(order.totalAmount)}</strong>

      <div style="margin-top: 1rem;">
        <button class="btn btn-primary reorder-btn">
          Reorder
        </button>
      </div>
    `;

    const reorderBtn = orderCard.querySelector(".reorder-btn");

    reorderBtn.addEventListener("click", () => {
      reorderItems(order);
    });

    ordersListEl.appendChild(orderCard);
  });
}

// Call on page load
renderOrders();

// ===== REORDER LOGIC =====

function reorderItems(order) {
  // 1️⃣ Clear existing cart
  localStorage.removeItem("grabitgreen_cart");

  // 2️⃣ Add order items to cart
  const reorderedCart = order.items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    unit: item.unit,
    quantity: item.quantity
  }));

  localStorage.setItem(
    "grabitgreen_cart",
    JSON.stringify(reorderedCart)
  );

  // 3️⃣ Update cart count
  updateCartCount();

  // 4️⃣ Redirect to cart page
  window.location.href = "cart.html";
}
