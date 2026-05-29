const STORAGE_KEY = "dyno_cart_v1";

const formatNGN = (value) => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₦${Number(value || 0).toLocaleString()}`;
  }
};

const PRODUCTS = [
  {
    id: "dyno-cloudstep-slides",
    name: "Cloudstep Slides",
    category: "slides",
    price: 24500,
    rating: 4.8,
    stock: "In stock",
    tag: "New",
    subtitle: "Soft-footbed comfort",
    desc:
      "Pillow-soft feel with a stable arch profile. Easy slip-on fit for daily wear—indoors or out.",
    image:
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-drift-runner",
    name: "Drift Runner",
    category: "shoes",
    price: 38900,
    rating: 4.7,
    stock: "Low stock",
    tag: "Best seller",
    subtitle: "Lightweight daily sneaker",
    desc:
      "Breathable mesh upper with a clean silhouette. Built for commutes, errands, and casual flex.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-easywear-set",
    name: "Easy-Wear Set",
    category: "easywear",
    price: 32900,
    rating: 4.6,
    stock: "In stock",
    tag: "Value",
    subtitle: "Breathable essentials",
    desc:
      "A clean everyday set designed for comfort. Soft feel, good drape, and easy styling.",
    image:
      "https://images.unsplash.com/photo-1520975958221-69e62e2f3d9c?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-street-low",
    name: "Street Low",
    category: "shoes",
    price: 42500,
    rating: 4.9,
    stock: "In stock",
    tag: "Top rated",
    subtitle: "Clean leather look",
    desc:
      "Minimal upper, stable outsole, and a comfy insole. Made to stay clean with most fits.",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-coast-slides",
    name: "Coast Slides",
    category: "slides",
    price: 21900,
    rating: 4.5,
    stock: "In stock",
    tag: "Everyday",
    subtitle: "Grip + comfort",
    desc:
      "A balanced slide: cushioned footbed, solid grip, and a sleek strap profile.",
    image:
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-airknit",
    name: "AirKnit Walk",
    category: "shoes",
    price: 35500,
    rating: 4.6,
    stock: "In stock",
    tag: "Lightweight",
    subtitle: "Breathable knit upper",
    desc:
      "Airy knit with a flexible midsole—built for long days on your feet.",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-easywear-tee",
    name: "Easy-Wear Tee",
    category: "easywear",
    price: 14900,
    rating: 4.4,
    stock: "In stock",
    tag: "Essential",
    subtitle: "Soft + structured",
    desc:
      "A premium tee that holds shape with a soft feel. Clean neckline and easy fit.",
    image:
      "https://images.unsplash.com/photo-1520975682035-3fc1e7c9f88f?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: "dyno-easywear-pants",
    name: "Easy-Wear Pants",
    category: "easywear",
    price: 26900,
    rating: 4.7,
    stock: "In stock",
    tag: "Comfort",
    subtitle: "Relaxed everyday fit",
    desc:
      "Relaxed fit with a clean taper. Made for all-day comfort and easy styling.",
    image:
      "https://images.unsplash.com/photo-1520975813841-0cf2b3f39dbb?auto=format&fit=crop&w=1400&q=75",
  },
];

const getCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

const upsertCartItem = (productId, qtyDelta = 1) => {
  const cart = getCart();
  const existing = cart.find((x) => x.productId === productId);
  if (existing) {
    existing.qty = Math.max(1, Number(existing.qty || 1) + qtyDelta);
  } else {
    cart.push({ productId, qty: 1 });
  }
  setCart(cart);
};

const setCartQty = (productId, qty) => {
  const cart = getCart();
  const n = Number(qty || 1);
  const nextQty = Number.isFinite(n) ? n : 1;
  const existing = cart.find((x) => x.productId === productId);
  if (!existing) return;
  existing.qty = Math.max(1, nextQty);
  setCart(cart);
};

const removeCartItem = (productId) => {
  setCart(getCart().filter((x) => x.productId !== productId));
};

const clearCart = () => setCart([]);

const cartCount = () => getCart().reduce((sum, x) => sum + Number(x.qty || 0), 0);

const cartSubtotal = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.productId);
    if (!p) return sum;
    return sum + p.price * Number(item.qty || 0);
  }, 0);
};

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const productGrid = qs("[data-product-grid]");
const cartCountEl = qs("[data-cart-count]");
const cartDrawer = qs("[data-cart-drawer]");
const cartItemsEl = qs("[data-cart-items]");
const cartSubtotalEl = qs("[data-cart-subtotal]");
const cartSubEl = qs("[data-cart-sub]");

const searchDrawer = qs("[data-search-drawer]");
const searchInput = qs("[data-search-input]");
const searchResults = qs("[data-search-results]");

const modal = qs("[data-product-modal]");
const modalMedia = qs("[data-modal-media]");
const modalTitle = qs("[data-modal-title]");
const modalSub = qs("[data-modal-sub]");
const modalPrice = qs("[data-modal-price]");
const modalCategory = qs("[data-modal-category]");
const modalStock = qs("[data-modal-stock]");
const modalRating = qs("[data-modal-rating]");
const modalDesc = qs("[data-modal-desc]");
const modalAdd = qs("[data-modal-add]");

let activeFilter = "all";
let modalProductId = null;

const renderProducts = () => {
  if (!productGrid) return;

  const visible = PRODUCTS.filter((p) => activeFilter === "all" || p.category === activeFilter);

  productGrid.innerHTML = visible
    .map((p) => {
      const catLabel =
        p.category === "shoes" ? "Shoes" : p.category === "slides" ? "Slides" : "Easy-wear";

      return `
        <article class="product" data-product="${p.id}">
          <div class="product-media" style="background:url('${p.image}') center/cover no-repeat">
            <div class="badge">${p.tag}</div>
          </div>
          <div class="product-body">
            <div class="product-top">
              <div>
                <div class="product-title">${p.name}</div>
                <div class="product-sub">${p.subtitle} • ${catLabel}</div>
              </div>
              <div class="product-price">${formatNGN(p.price)}</div>
            </div>

            <div class="product-actions">
              <button class="btn btn-primary" type="button" data-add>Add to cart</button>
              <button class="btn btn-ghost" type="button" data-view>Quick view</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
};

const openCart = () => {
  if (!cartDrawer) return;
  cartDrawer.classList.add("is-open");
  document.body.style.overflow = "hidden";
  renderCart();
};

const closeCart = () => {
  if (!cartDrawer) return;
  cartDrawer.classList.remove("is-open");
  document.body.style.overflow = "";
};

const openSearch = () => {
  if (!searchDrawer) return;
  searchDrawer.classList.add("is-open");
  document.body.style.overflow = "hidden";
  setTimeout(() => searchInput?.focus(), 40);
  renderSearch("");
};

const closeSearch = () => {
  if (!searchDrawer) return;
  searchDrawer.classList.remove("is-open");
  document.body.style.overflow = "";
};

const setCartCountUI = () => {
  if (cartCountEl) cartCountEl.textContent = String(cartCount());
};

const renderCart = () => {
  if (!cartItemsEl) return;

  const cart = getCart();
  const count = cartCount();
  const subtotal = cartSubtotal();

  if (cartSubEl) cartSubEl.textContent = `${count} item${count === 1 ? "" : "s"}`;
  if (cartSubtotalEl) cartSubtotalEl.textContent = formatNGN(subtotal);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="card" style="padding:14px">
        <div style="font-weight:950;letter-spacing:-.02em">Your cart is empty</div>
        <div class="muted" style="margin-top:6px">Browse products and add your favorites.</div>
        <div style="margin-top:12px">
          <button class="btn btn-primary" type="button" data-cart-close>Continue shopping</button>
        </div>
      </div>
    `;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      if (!p) return "";
      const line = p.price * Number(item.qty || 0);
      return `
        <div class="cart-item" data-cart-item="${p.id}">
          <div class="cart-thumb" style="background-image:url('${p.image}')"></div>
          <div>
            <div class="cart-name">${p.name}</div>
            <div class="cart-meta">${formatNGN(p.price)} • ${p.category}</div>

            <div class="cart-row">
              <div class="qty">
                <button class="icon-btn" type="button" data-dec aria-label="Decrease quantity">−</button>
                <span data-qty>${item.qty}</span>
                <button class="icon-btn" type="button" data-inc aria-label="Increase quantity">+</button>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="font-weight:950">${formatNGN(line)}</div>
                <button class="icon-btn" type="button" data-remove aria-label="Remove item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M4 7h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M7 7l1 14h8l1-14" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
};

const openModalFor = (productId) => {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p || !modal) return;

  modalProductId = productId;
  modalMedia.style.backgroundImage = `url('${p.image}')`;
  modalTitle.textContent = p.name;
  modalSub.textContent = p.subtitle;
  modalPrice.textContent = formatNGN(p.price);
  modalCategory.textContent = p.category;
  modalStock.textContent = p.stock;
  modalRating.textContent = `${p.rating} / 5`;
  modalDesc.textContent = p.desc;

  modal.showModal();
};

const renderSearch = (query) => {
  if (!searchResults) return;
  const q = String(query || "").trim().toLowerCase();

  const results = PRODUCTS.filter((p) => {
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  searchResults.innerHTML = results
    .map((p) => {
      return `
        <div class="search-result" data-search-item="${p.id}">
          <div>
            <strong>${p.name}</strong>
            <small>${p.category} • ${formatNGN(p.price)}</small>
          </div>
          <button class="btn btn-pill" type="button" data-view>View</button>
        </div>
      `;
    })
    .join("");
};

const bindEvents = () => {
  // Header
  qs("[data-menu-toggle]")?.addEventListener("click", () => {
    const mobile = qs("[data-mobile-nav]");
    if (!mobile) return;
    mobile.classList.toggle("is-open");
  });

  qs("[data-cart-open]")?.addEventListener("click", openCart);
  qsa("[data-cart-close]").forEach((el) => el.addEventListener("click", closeCart));

  qs("[data-search-open]")?.addEventListener("click", openSearch);
  qsa("[data-search-close]").forEach((el) => el.addEventListener("click", closeSearch));

  // CTA scroll
  qsa("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll-to");
      const el = id ? document.getElementById(id) : null;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Collections filter shortcuts
  qsa("[data-filter]").forEach((a) => {
    a.addEventListener("click", () => {
      const f = a.getAttribute("data-filter");
      if (!f) return;
      setFilter(f);
    });
  });

  // Filter pills
  qsa("[data-filter-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-filter");
      if (!f) return;
      setFilter(f);
    });
  });

  // Products (delegated)
  productGrid?.addEventListener("click", (e) => {
    const target = e.target;
    const card = target?.closest?.("[data-product]");
    if (!card) return;
    const id = card.getAttribute("data-product");
    if (!id) return;

    if (target.matches("[data-add]")) {
      upsertCartItem(id, 1);
      setCartCountUI();
      openCart();
    }

    if (target.matches("[data-view]")) {
      openModalFor(id);
    }
  });

  // Modal add
  modalAdd?.addEventListener("click", () => {
    if (!modalProductId) return;
    upsertCartItem(modalProductId, 1);
    setCartCountUI();
    modal.close();
    openCart();
  });

  // Cart interactions
  cartItemsEl?.addEventListener("click", (e) => {
    const target = e.target;
    const row = target?.closest?.("[data-cart-item]");
    if (!row) return;
    const id = row.getAttribute("data-cart-item");
    if (!id) return;

    if (target.closest("[data-inc]")) {
      upsertCartItem(id, 1);
      setCartCountUI();
      renderCart();
    }

    if (target.closest("[data-dec]")) {
      const cart = getCart();
      const existing = cart.find((x) => x.productId === id);
      if (!existing) return;
      const next = Math.max(1, Number(existing.qty || 1) - 1);
      setCartQty(id, next);
      setCartCountUI();
      renderCart();
    }

    if (target.closest("[data-remove]")) {
      removeCartItem(id);
      setCartCountUI();
      renderCart();
    }
  });

  qs("[data-cart-clear]")?.addEventListener("click", () => {
    clearCart();
    setCartCountUI();
    renderCart();
  });

  // Search
  searchInput?.addEventListener("input", (e) => {
    renderSearch(e.target.value);
  });

  searchResults?.addEventListener("click", (e) => {
    const target = e.target;
    const item = target?.closest?.("[data-search-item]");
    if (!item) return;
    const id = item.getAttribute("data-search-item");
    if (!id) return;

    if (target.matches("[data-view]") || target.closest("[data-view]")) {
      openModalFor(id);
    }
  });

  // Newsletter (UI only)
  qs("[data-newsletter-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector("input[name='email']");
    const email = input?.value?.trim();
    if (!email) return;
    input.value = "";
    closeSearch();
    alert("Thanks — you’re on the Dyno list!");
  });

  // Global escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeSearch();
    }
  });
};

const setFilter = (filter) => {
  activeFilter = filter;
  qsa("[data-filter-btn]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-filter") === filter);
  });
  renderProducts();
};

const init = () => {
  const year = qs("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  setCartCountUI();
  renderProducts();
  bindEvents();
};

init();
