/* ---------------- CONFIG ---------------- */
const WHATSAPP_NUMBER = "628121123890"; // Savannah & Co. — 0812-1123-890, format internasional tanpa "+"
const STORE_NAME = "Savannah & Co.";

/* ---------------- PRODUCT DATA ---------------- */
const products = [
  {
    id: "peach-soda",
    name: "Iced Peach Soda",
    desc: "Soda biru kehijauan dengan sentuhan rasa persik yang segar, kayak lagi liburan ke pantai.",
    price: 20000,
    accent: "var(--peach)",
    stageBg: "linear-gradient(160deg, #FDEBD3, #FBD7A8)",
    image: "../images/peach-soda.png"
  },
  {
    id: "coffee-latte",
    name: "Iced Coffee Latte",
    desc: "Kopi kekinian yang halus, creamy, dan bikin semangat sepanjang hari.",
    price: 18000,
    accent: "var(--coffee)",
    stageBg: "linear-gradient(160deg, #EFE3D6, #DCC4A9)",
    image: "../images/coffee-latte.png"
  },
  {
    id: "strawberry-soda",
    name: "Iced Strawberry Soda",
    desc: "Segarnya stroberi manis berpadu dengan soda yang bergelembung.",
    price: 20000,
    accent: "var(--strawberry)",
    stageBg: "linear-gradient(160deg, #FBE1E5, #F6BFC8)",
    image: "../images/strawberry-soda.png"
  },
  {
    id: "choco-milkshake",
    name: "Iced Chocolate Milkshake",
    desc: "Perpaduan cokelat dan stroberi yang lumer di mulut.",
    price: 18000,
    accent: "var(--choco)",
    stageBg: "linear-gradient(160deg, #F1E7DC, #DDC4AE)",
    image: "../images/choco-milkshake.png"
  },
  {
    id: "choco-strawberry",
    name: "Iced Chocolate Strawberry",
    desc: "Sederhana tapi bikin bahagia. Cokelat dingin yang creamy dan nikmat di setiap tegukan.",
    price: 15000,
    accent: "var(--strawberry-dark)",
    stageBg: "linear-gradient(160deg, #F3E1DE, #E6C2BE)",
    image: "../images/choco-strawberry.png"
  },
  {
    id: "Milkshake",
    name: "Milkshake",
    desc: "milkshake milkshake apa yang enak?  handshake",
    price: 18000,
    accent: "var(--strawberry-dark)",
    stageBg: "linear-gradient(160deg, F3E1DE, #E6C2BE)",
    image: "../images/milkshake.webp"
  }
];

const cart = {}; // id -> qty

/* ---------------- PRODUCT IMAGE BUILDER ----------------
   Each product now shows a real photo slot. Drop your photo files into an
   "images" folder next to this HTML file, named to match each product's
   "image" path in the products array above (e.g. images/peach-soda.png).
   Until a photo is found, a soft placeholder is shown automatically. */
function productImageHTML(p, small){
  const tagHtml = small ? '' : `<span class="stage-tag">${p.name}</span>`;
  return `
    <img class="product-img" src="${p.image}" alt="${p.name}"
         onerror="this.onerror=null; this.remove(); document.getElementById('ph-${p.id}${small?'-sm':''}').style.display='flex';">
    ${tagHtml}
    <div class="img-placeholder" id="ph-${p.id}${small?'-sm':''}" style="display:none;">
      <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="10" r="1.6" fill="currentColor"/><path d="M4.5 16.5l4.5-4.5 3 3 3.5-4 4.5 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${small ? '' : '<span>Foto produk belum ditambahkan — letakkan file di folder images/</span>'}
    </div>`;
}

/* ---------------- RENDER PRODUCTS ---------------- */
const grid = document.getElementById('productGrid');
products.forEach(p=>{
  cart[p.id] = 0;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="cup-stage" style="--stage-bg:${p.stageBg}">${productImageHTML(p, false)}</div>
    <div class="card-name">${p.name}</div>
    <div class="card-desc">${p.desc}</div>
    <div class="card-footer">
      <div class="price-pill" style="background:${p.accent}">Rp ${p.price.toLocaleString('id-ID')}</div>
      <div class="qty-row">
        <button class="qty-btn" onclick="changeQty('${p.id}', -1)">–</button>
        <div class="qty-val" id="qty-${p.id}">0</div>
        <button class="qty-btn" onclick="changeQty('${p.id}', 1)">+</button>
      </div>
    </div>
    <button class="add-btn" id="add-${p.id}" onclick="addToCart('${p.id}')">+ Keranjang</button>
  `;
  grid.appendChild(card);
});

function changeQty(id, delta){
  const el = document.getElementById('qty-'+id);
  let val = parseInt(el.textContent) + delta;
  if(val < 0) val = 0;
  el.textContent = val;
}

function addToCart(id){
  const qtyEl = document.getElementById('qty-'+id);
  const qty = parseInt(qtyEl.textContent);
  if(qty <= 0){
    qtyEl.textContent = 1;
    cart[id] = (cart[id]||0) + 1;
  } else {
    cart[id] = (cart[id]||0) + qty;
    qtyEl.textContent = 0;
  }
  const btn = document.getElementById('add-'+id);
  btn.classList.add('added');
  btn.textContent = '✓ Ditambahkan';
  setTimeout(()=>{ btn.classList.remove('added'); btn.textContent='+ Keranjang'; }, 900);
  renderCart();
}

/* ---------------- CART RENDER ---------------- */
function renderCart(){
  const body = document.getElementById('drawerBody');
  const items = products.filter(p => cart[p.id] > 0);
  let total = 0;
  let count = 0;

  if(items.length === 0){
    body.innerHTML = `<div class="drawer-empty">Keranjang masih kosong.<br>Yuk pilih minuman favoritmu 🍹</div>`;
  } else {
    body.innerHTML = items.map(p=>{
      const qty = cart[p.id];
      total += qty * p.price;
      count += qty;
      return `
        <div class="drawer-item">
          <div class="dot-cup" style="background:${p.accent}22; position:relative; overflow:hidden;">${productImageHTML(p, true)}</div>
          <div class="drawer-item-info">
            <b>${p.name}</b>
            <span>Rp ${p.price.toLocaleString('id-ID')} x ${qty}</span>
          </div>
          <div class="drawer-item-qty">
            <button onclick="cartQty('${p.id}', -1)">–</button>
            <span>${qty}</span>
            <button onclick="cartQty('${p.id}', 1)">+</button>
          </div>
        </div>`;
    }).join('');
  }

  document.getElementById('drawerTotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
  document.getElementById('cartCountTop').textContent = count;
  document.getElementById('mobileTotal').textContent = total.toLocaleString('id-ID');
  document.getElementById('mobileCount').textContent = ' • ' + count + ' item';

  const waBtn = document.getElementById('drawerWaBtn');
  waBtn.disabled = count === 0;
  waBtn.onclick = () => sendWhatsAppOrder(items, total);

  const mobileBar = document.getElementById('mobileBar');
  if(count > 0){ mobileBar.classList.add('show'); } else { mobileBar.classList.remove('show'); }
}

function cartQty(id, delta){
  cart[id] = Math.max(0, (cart[id]||0) + delta);
  renderCart();
}

/* ---------------- DRAWER TOGGLE ---------------- */
function openDrawer(){
  document.getElementById('drawer').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

/* ---------------- WHATSAPP INTEGRATION ---------------- */
function buildWaLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function sendWhatsAppOrder(items, total){
  let msg = `Halo ${STORE_NAME}! 👋\nSaya mau pesan:\n\n`;
  items.forEach(p=>{
    const qty = cart[p.id];
    msg += `• ${p.name} x${qty} — Rp ${(p.price*qty).toLocaleString('id-ID')}\n`;
  });
  msg += `\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nMohon info langkah selanjutnya ya. Terima kasih! 🙏`;
  window.open(buildWaLink(msg), '_blank');
}

/* Hero & footer quick WhatsApp buttons (general greeting, no cart needed) */
const genericMsg = `Halo ${STORE_NAME}! Saya mau tanya-tanya soal menu Summer Sale kalian 🍹`;
document.getElementById('heroWaBtn').href = buildWaLink(genericMsg);
document.getElementById('footerWaBtn').href = buildWaLink(genericMsg);

/* ---------------- BUBBLES ANIMATION ---------------- */
const bubbleWrap = document.getElementById('bubbles');
for(let i=0;i<18;i++){
  const b = document.createElement('div');
  const size = 4 + Math.random()*10;
  b.className = 'bubble';
  b.style.width = size+'px';
  b.style.height = size+'px';
  b.style.left = (Math.random()*100)+'%';
  b.style.animationDuration = (6 + Math.random()*8)+'s';
  b.style.animationDelay = (Math.random()*8)+'s';
  bubbleWrap.appendChild(b);
}

renderCart();
