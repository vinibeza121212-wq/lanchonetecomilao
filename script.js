const cart = [];

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const whatsappNumber = document.body.dataset.whatsappNumber;
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function addToCart(name, price) {
  if (!name || !Number.isFinite(price) || price <= 0) {
    showToast("Não foi possível adicionar esse item");
    return;
  }

  const existing = cart.find((item) => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({ name, price, quantity: 1 });

  renderCart();
  showToast(`${name} adicionado ao carrinho`);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div><strong>${escapeHtml(item.name)}</strong><small>${item.quantity} × ${currency.format(item.price)}</small></div>
        <div class="cart-item-controls">
          <button type="button" data-action="minus" data-index="${index}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-index="${index}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `).join("");
  }

  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = quantity;
  cartTotal.textContent = currency.format(total);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-name][data-add-price]");
  if (!button) return;
  addToCart(button.dataset.addName, Number(button.dataset.addPrice));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (button.dataset.action === "plus") cart[index].quantity += 1;
  if (button.dataset.action === "minus") {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
  }
  renderCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Adicione um item antes de finalizar");
    return;
  }

  const lines = cart.map((item) => `${item.quantity}x ${item.name}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Olá! Este é um pedido de demonstração do site fictício Comilão:\n${lines.join("\n")}\nTotal: ${currency.format(total)}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".filter").forEach((item) => item.setAttribute("aria-pressed", "false"));
    filter.classList.add("active");
    filter.setAttribute("aria-pressed", "true");
    const category = filter.dataset.filter;

    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", category !== "todos" && card.dataset.category !== category);
    });

    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.href = `https://wa.me/${whatsappNumber}`;
    });
  });
});

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});
