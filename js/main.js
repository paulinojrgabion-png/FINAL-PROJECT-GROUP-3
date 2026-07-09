// js/main.js
// Site prototype JavaScript
// Features:
// - Add to cart
// - Cart badge update
// - Cart page rendering
// - Quantity controls
// - Remove item
// - Checkout simulation

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("siteCart")) || [];

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function saveCart() {
    localStorage.setItem("siteCart", JSON.stringify(cart));
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function updateCartBadge() {
    if (cartCount) {
      cartCount.textContent = getCartCount();
    }
  }

  function renderCartPage() {
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = `<p class="text-muted mb-0">Your cart is empty.</p>`;
      cartTotal.textContent = "₱0";
      return;
    }

    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "border-bottom py-3";

      row.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 class="h6 mb-1">${item.name}</h3>
            <p class="mb-0 text-muted">₱${item.price.toLocaleString()} each</p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-dark btn-sm quantity-btn" data-action="decrease" data-index="${index}">-</button>
            <span class="px-2">${item.quantity}</span>
            <button class="btn btn-outline-dark btn-sm quantity-btn" data-action="increase" data-index="${index}">+</button>
            <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>
      `;

      cartItems.appendChild(row);
    });

    cartTotal.textContent = `₱${getCartTotal().toLocaleString()}`;
  }

  function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: Number(price),
        quantity: 1
      });
    }

    saveCart();
    updateCartBadge();
    renderCartPage();
  }

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product;
      const productPrice = button.dataset.price;

      addToCart(productName, productPrice);

      const originalText = button.textContent;
      button.textContent = "Added!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    });
  });

  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const target = event.target;
      const index = Number(target.dataset.index);

      if (target.classList.contains("quantity-btn")) {
        if (target.dataset.action === "increase") {
          cart[index].quantity += 1;
        }

        if (target.dataset.action === "decrease") {
          cart[index].quantity -= 1;

          if (cart[index].quantity < 1) {
            cart.splice(index, 1);
          }
        }

        saveCart();
        updateCartBadge();
        renderCartPage();
      }

      if (target.classList.contains("remove-btn")) {
        cart.splice(index, 1);
        saveCart();
        updateCartBadge();
        renderCartPage();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
      } else {
        alert("Checkout simulation complete. This is only a prototype.");
      }
    });
  }

  updateCartBadge();
  renderCartPage();
});