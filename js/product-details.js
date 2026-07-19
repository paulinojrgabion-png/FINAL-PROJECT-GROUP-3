document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cartCount");
  const sizeOptions = document.getElementById("sizeOptions");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const quantityValue = document.getElementById("quantityValue");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.querySelector(".product-image");

  let selectedSize = "Small";
  let quantity = 1;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("siteCart")) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("siteCart", JSON.stringify(cart));
  }

  function updateCartBadge() {
    if (window.Site && typeof window.Site.updateCartBadge === "function") {
      window.Site.updateCartBadge();
      return;
    }

    const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    if (cartCount) {
      cartCount.textContent = count;
    }
  }

  function updateQuantity() {
    if (quantityValue) {
      quantityValue.textContent = quantity;
    }
  }

  function updateSizeButtons() {
    if (!sizeOptions) return;

    const buttons = sizeOptions.querySelectorAll(".option-btn");
    buttons.forEach(button => {
      button.classList.toggle("active", button.dataset.size === selectedSize);
    });
  }

  function addToCart() {
    const item = {
      id: "chasing-sunsets-tee",
      name: productName.textContent.trim(),
      price: Number(productPrice.dataset.price || 499),
      image: productImage.getAttribute("src"),
      size: selectedSize,
      quantity: quantity
    };

    if (window.Site && typeof window.Site.addToCart === "function") {
      window.Site.addToCart(item, quantity, selectedSize);
    } else {
      const cart = getCart();
      const existing = cart.find(entry => entry.id === item.id && entry.size === item.size);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity
        });
      }

      saveCart(cart);
    }

    updateCartBadge();

    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = "Added!";
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
    }, 1000);
  }

  if (sizeOptions) {
    sizeOptions.addEventListener("click", (event) => {
      const button = event.target.closest(".option-btn");
      if (!button) return;

      selectedSize = button.dataset.size;
      updateSizeButtons();
    });
  }

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity -= 1;
        updateQuantity();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      quantity += 1;
      updateQuantity();
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart);
  }

  updateSizeButtons();
  updateQuantity();
  updateCartBadge();
});