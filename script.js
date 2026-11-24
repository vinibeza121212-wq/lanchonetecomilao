const cart = [];

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

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
        <div><strong>${item.name}</strong><small>${item.quantity} × R$ ${item.price.toFixed(2).replace(".", ",")}</small></div>
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
  cartTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find((item) => item.name === name);

    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });

    renderCart();
    toast.textContent = `${name} adicionado ao carrinho`;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
  });
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

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    toast.textContent = "Adicione um item antes de finalizar";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
    return;
  }

  const lines = cart.map((item) => `${item.quantity}x ${item.name}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Olá! Quero fazer um pedido no Comilão:\n${lines.join("\n")}\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`;
  window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, "_blank");
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;

    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", category !== "todos" && card.dataset.category !== category);
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
