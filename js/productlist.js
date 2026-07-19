document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cartCount");
  const productSearch = document.getElementById("productSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productItems = document.querySelectorAll(".product-item");

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

  function applyFilters() {
    const searchText = productSearch.value.toLowerCase().trim();
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";

    productItems.forEach(item => {
      const name = item.dataset.name || "";
      const category = item.dataset.category || "";

      const matchesSearch =
        name.includes(searchText) ||
        category.includes(searchText);

      const matchesFilter =
        activeFilter === "all" || category === activeFilter;

      item.style.display = matchesSearch && matchesFilter ? "" : "none";
    });
  }

  if (productSearch) {
    productSearch.addEventListener("input", applyFilters);
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) return;

    const card = button.closest(".product-item");
    if (!card) return;

    const product = {
      id: card.dataset.productId,
      name: card.dataset.productName,
      price: Number(card.dataset.productPrice),
      image: card.dataset.productImage
    };

    if (window.Site && typeof window.Site.addToCart === "function") {
      window.Site.addToCart(product, 1, "Default");
    } else {
      const cart = getCart();
      const existing = cart.find(item => item.id === product.id && item.size === "Default");

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: "Default",
          quantity: 1
        });
      }

      saveCart(cart);
    }

    updateCartBadge();

    const originalText = button.textContent;
    button.textContent = "Added!";
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  });

  applyFilters();
  updateCartBadge();
});