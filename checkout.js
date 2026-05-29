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
  },
  {
    id: "dyno-drift-runner",
    name: "Drift Runner",
    category: "shoes",
    price: 38900,
  },
  {
    id: "dyno-easywear-set",
    name: "Easy-Wear Set",
    category: "easywear",
    price: 32900,
  },
  {
    id: "dyno-street-low",
    name: "Street Low",
    category: "shoes",
    price: 42500,
  },
  {
    id: "dyno-coast-slides",
    name: "Coast Slides",
    category: "slides",
    price: 21900,
  },
  {
    id: "dyno-airknit",
    name: "AirKnit Walk",
    category: "shoes",
    price: 35500,
  },
  {
    id: "dyno-easywear-tee",
    name: "Easy-Wear Tee",
    category: "easywear",
    price: 14900,
  },
  {
    id: "dyno-easywear-pants",
    name: "Easy-Wear Pants",
    category: "easywear",
    price: 26900,
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

const clearCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

const subtotal = () => {
  return getCart().reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.productId);
    if (!p) return sum;
    return sum + p.price * Number(item.qty || 0);
  }, 0);
};

const qs = (sel, root = document) => root.querySelector(sel);

const render = () => {
  const list = qs("[data-order-list]");
  const sub = qs("[data-subtotal]");
  const total = qs("[data-total]");

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="muted">Your cart is empty. Go back and add items to checkout.</div>
    `;
    sub.textContent = formatNGN(0);
    total.textContent = formatNGN(0);
    return;
  }

  list.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      if (!p) return "";
      const line = p.price * Number(item.qty || 0);
      return `
        <div class="order-line">
          <div>
            <div style="font-weight:950;letter-spacing:-.02em">${p.name}</div>
            <div class="muted" style="font-weight:650">Qty ${item.qty} • ${p.category}</div>
          </div>
          <strong>${formatNGN(line)}</strong>
        </div>
      `;
    })
    .join("");

  const s = subtotal();
  sub.textContent = formatNGN(s);
  total.textContent = formatNGN(s);
};

qs("[data-checkout-form]")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const s = subtotal();
  if (s <= 0) return;

  clearCart();
  render();
  alert("Order placed (demo). We’ll contact you shortly.");
});

render();
