// Load and render products on homepage
console.log("products.js loaded");

async function loadProducts() {
  const productListEl = document.getElementById("product-list");

  if (!productListEl) return;

  try {
    const products = await apiGet("/products");

    localStorage.setItem("grabitgreen_all_products", JSON.stringify(products));


    productListEl.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <span class="badge badge-green">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="card-actions">
            <span class="product-price">${formatPrice(product.price)} • ${product.unit}</span>
            <button class="btn btn-primary add-btn">Add</button>
        </div>
        `;
        const addBtn = card.querySelector(".add-btn");

        addBtn.addEventListener("click", () => {
            addToCart(product);
            console.log("Added to cart:", product.name);
        });



      productListEl.appendChild(card);
    });
  } catch (error) {
    productListEl.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Call on page load
loadProducts();
