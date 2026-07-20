// js/main.js
// Shared cart system for C'monThread

const STORAGE_KEY = "siteCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
}

function getCartTotal() {
  return getCart().reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
}

function updateCartBadge() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = getCartCount();
  }
}

function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  const cart = getCart();
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
          <p class="mb-1 text-muted">Size: ${item.size || "Default"}</p>
          <p class="mb-0 text-muted">₱${Number(item.price).toLocaleString()} each</p>
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

function addToCart(product, quantity = 1, size = "Default") {
  if (!product || !product.id) return;

  const cart = getCart();
  const existingItem = cart.find(
    item => item.id === product.id && item.size === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      size: size,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function removeFromCart(id, size) {
  const cart = getCart().filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function updateQuantity(id, size, quantity) {
  const cart = getCart();
  const item = cart.find(product => product.id === id && product.size === size);

  if (!item) return;

  item.quantity = quantity;

  if (item.quantity <= 0) {
    removeFromCart(id, size);
    return;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty.");
      } else {
        alert("Checkout simulation complete. This is only a prototype.");
      }
    });
  }

  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const target = event.target;
      const index = Number(target.dataset.index);
      const cart = getCart();

      if (target.classList.contains("quantity-btn")) {
        const item = cart[index];
        if (!item) return;

        if (target.dataset.action === "increase") {
          item.quantity += 1;
        }

        if (target.dataset.action === "decrease") {
          item.quantity -= 1;
          if (item.quantity < 1) {
            cart.splice(index, 1);
          }
        }

        saveCart(cart);
        updateCartBadge();
        renderCartPage();
      }

      if (target.classList.contains("remove-btn")) {
        cart.splice(index, 1);
        saveCart(cart);
        updateCartBadge();
        renderCartPage();
      }
    });
  }
});

window.Site = {
  getCart,
  saveCart,
  getCartCount,
  getCartTotal,
  addToCart,
  removeFromCart,
  updateQuantity,
  updateCartBadge,
  renderCartPage
};