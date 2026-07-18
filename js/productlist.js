document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: "classic-white-shirt",
      name: "Classic White Shirt",
      category: "tops",
      price: 499,
      image: "images/product-1.jpg",
      description: "A clean and versatile white shirt made for casual and formal wear."
    },
    {
      id: "oversized-denim-jacket",
      name: "Oversized Denim Jacket",
      category: "outerwear",
      price: 599,
      image: "images/product-2.jpg",
      description: "A relaxed denim jacket with a modern oversized fit."
    },
    {
      id: "minimal-black-dress",
      name: "Minimal Black Dress",
      category: "dresses",
      price: 549,
      image: "images/product-3.jpg",
      description: "A simple elegant black dress designed for a clean, timeless look."
    },
    {
      id: "relaxed-fit-trousers",
      name: "Relaxed Fit Trousers",
      category: "bottoms",
      price: 499,
      image: "images/product-4.jpg",
      description: "Comfortable trousers with a loose fit for everyday styling."
    }
  ];

  let cart = JSON.parse(localStorage.getItem("siteCart")) || [];

  const cartCount = document.getElementById("cartCount");
  const productGrid = document.getElementById("productGrid");
  const productSearch = document.getElementById("productSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const detailImage = document.getElementById("detailImage");
  const detailCategory = document.getElementById("detailCategory");
  const detailName = document.getElementById("detailName");
  const detailDescription = document.getElementById("detailDescription");
  const detailPrice = document.getElementById("detailPrice");
  const detailAddToCart = document.getElementById("detailAddToCart");

  function saveCart() {
    localStorage.setItem("siteCart", JSON.stringify(cart));
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateCartBadge() {
    if (cartCount) {
      cartCount.textContent = getCartCount();
    }
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    saveCart();
    updateCartBadge();
  }

  function createProductCard(product) {
    return `
      <div class="col-sm-6 col-lg-3 product-item" data-name="${product.name.toLowerCase()}" data-category="${product.category}">
        <div class="card product-card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <p class="text-uppercase text-muted small mb-1">${product.category}</p>
            <h3 class="h6">${product.name}</h3>
            <p class="fw-bold mb-3">₱${product.price.toLocaleString()}</p>

            <div class="mt-auto d-grid gap-2">
              <a href="product-details.html?item=${product.id}" class="btn btn-outline-dark">View Details</a>
              <button class="btn btn-dark add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProducts(list) {
    if (!productGrid) return;
    productGrid.innerHTML = list.map(createProductCard).join("");
  }

  function getFilteredProducts() {
    const searchText = productSearch ? productSearch.value.toLowerCase().trim() : "";
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";

    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesFilter = activeFilter === "all" || product.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }

  function loadProductDetails() {
    if (!detailImage || !detailName || !detailDescription || !detailPrice || !detailCategory) return;

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("item");

    const product = products.find(p => p.id === itemId) || products[0];

    detailImage.src = product.image;
    detailImage.alt = product.name;
    detailCategory.textContent = product.category;
    detailName.textContent = product.name;
    detailDescription.textContent = product.description;
    detailPrice.textContent = `₱${product.price.toLocaleString()}`;

    if (detailAddToCart) {
      detailAddToCart.addEventListener("click", () => {
        addToCart(product);
        detailAddToCart.textContent = "Added!";
        setTimeout(() => {
          detailAddToCart.textContent = "Add to Cart";
        }, 1000);
      });
    }
  }

  if (productGrid) {
    renderProducts(products);
  }

  if (productSearch) {
    productSearch.addEventListener("input", () => {
      renderProducts(getFilteredProducts());
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderProducts(getFilteredProducts());
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) return;

    const productId = button.dataset.id;
    const product = products.find(p => p.id === productId);

    if (product) {
      addToCart(product);
      button.textContent = "Added!";
      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 1000);
    }
  });

  updateCartBadge();
  loadProductDetails();
});