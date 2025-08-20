
// Helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Navbar mobile
const menuBtn = $('#menuBtn');
const links = $('#links');
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

// Footer year
$('#yr').textContent = new Date().getFullYear();

// Render menu items into cards (reusable)
function itemCardHTML(name, price, sectionKey){
  const safe = name.replace(/'/g,"&#39;");
  return `<div class="card" data-name="${safe.toLowerCase()}" data-section="${sectionKey}">
    <div class="pad item">
      <div>${name}<div class="muted">Freshly prepared</div></div>
      <div style="text-align:right">
        <div class="price">₹${price}</div>
        <button class="btn" onclick="addItem('${safe}', ${price})" aria-label="Add ${safe} to cart">Add</button>
      </div>
    </div>
  </div>`;
}

function renderMenuSection(sectionKey){
  const container = document.querySelector(`.grid[data-section="${sectionKey}"]`);
  if(!container || !MENU[sectionKey]) return;
  container.innerHTML = MENU[sectionKey].map(([n,p])=> itemCardHTML(n,p,sectionKey)).join('');
}

// Initial render
Object.keys(MENU).forEach(renderMenuSection);

// Search + Category filter
const chipRow = $('#chipRow');
function renderChips(){
  chipRow.innerHTML = CATEGORY_MAP.map(([label,key],i)=>`<button class="chip ${i===0?'active':''}" data-key="${key}" role="tab" aria-selected="${i===0?'true':'false'}">${label}</button>`).join('');
}
renderChips();

let activeCategory = 'all';
$('#chipRow').addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip'); if(!btn) return;
  $$('.chip').forEach(b=>{b.classList.remove('active'); b.setAttribute('aria-selected','false');});
  btn.classList.add('active'); btn.setAttribute('aria-selected','true');
  activeCategory = btn.dataset.key;
  applyFilters();
});

$('#searchBar').addEventListener('input', applyFilters);

function applyFilters(){
  const q = $('#searchBar').value.toLowerCase().trim();
  $$('.card').forEach(card=>{
    const name = card.dataset.name;
    const section = card.dataset.section;
    const matchText = !q || name.includes(q);
    const matchCat = activeCategory==='all' || section===activeCategory;
    card.style.display = (matchText && matchCat) ? 'block' : 'none';
  });
}

// ---- Cart ----
const cart = JSON.parse(localStorage.getItem('leelasCart') || '{}');
function saveCart(){ localStorage.setItem('leelasCart', JSON.stringify(cart)); }
function addItem(name, price){
  if(!cart[name]) cart[name] = {qty:0, price};
  cart[name].qty++; saveCart(); updateCartUI(); showToast(`${name} added to cart`);
}
window.addItem = addItem; // expose for inline onclick

const cartPanel = $('#cartPanel');
const cartFab = $('#cartFab');
const closeCart = $('#closeCart');
const cartItems = $('#cartItems');
const cartTotal = $('#cartTotal');
const cartCount = $('#cartCount');

function updateCartUI(){
  const entries = Object.entries(cart);
  cartCount.textContent = entries.reduce((a,[,v])=>a+v.qty,0);
  let total=0;
  cartItems.innerHTML = entries.map(([name, {qty, price}])=>{
    total += qty*price;
    const safe = name.replace(/'/g,"&#39;");
    return `
      <div class="cart-item">
        <div>${name}<div class="muted">₹${price} each</div></div>
        <div class="qty">
          <button onclick="changeQty('${safe}', -1)" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button onclick="changeQty('${safe}', 1)" aria-label="Increase quantity">+</button>
        </div>
        <div class="price">₹${qty*price}</div>
      </div>`;
  }).join('') || '<p class="muted">Your cart is empty.</p>';
  cartTotal.textContent = '₹'+total;
}
window.changeQty = function(name, delta){
  if(!cart[name]) return;
  cart[name].qty += delta;
  if(cart[name].qty<=0) delete cart[name];
  saveCart(); updateCartUI();
};

cartFab.addEventListener('click',()=>{
  cartPanel.classList.add('open');
  cartPanel.setAttribute('aria-hidden','false');
});
closeCart.addEventListener('click',()=>{
  cartPanel.classList.remove('open');
  cartPanel.setAttribute('aria-hidden','true');
});
updateCartUI();

// Print / Save order as PDF (uses browser print to PDF)
$('#printBill').addEventListener('click',()=>{
  const w=window.open('','','width=680,height=800');
  const entries=Object.entries(cart);
  const rows=entries.map(([n,v])=>`<tr><td>${n}</td><td>${v.qty}</td><td>₹${v.price}</td><td>₹${v.qty*v.price}</td></tr>`).join('');
  const total=entries.reduce((t,[,v])=>t+v.qty*v.price,0);
  w.document.write(`
    <h2>Leela's Sweets & Restaurant – Order</h2>
    <table border="1" cellspacing="0" cellpadding="6">
      <tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
      ${rows||'<tr><td colspan="4">No items</td></tr>'}
      <tr><td colspan="3" align="right"><strong>Total</strong></td><td><strong>₹${total}</strong></td></tr>
    </table>
    <p>Thank you! 📞 +91 98765 43210</p>
  `);
  w.document.close();
  w.print();
});

// Email order (mailto) with toast
$('#mailOrder').addEventListener('click',()=>{
  const entries=Object.entries(cart);
  if(!entries.length){showToast('Cart is empty');return}
  const lines=entries.map(([n,v])=>`${n} x${v.qty} = ₹${v.qty*v.price}`).join('%0A');
  const total=entries.reduce((t,[,v])=>t+v.qty*v.price,0);
  const subject=encodeURIComponent("New Order – Leela's");
  const body=encodeURIComponent(`Order details:%0A${lines}%0ATotal: ₹${total}`);
  window.location.href=`mailto:hello@leelas.in?subject=${subject}&body=${body}`;
});

// ---- Payment modal (placeholder) ----
const payModal = $('#payModal');
$('#payNow').addEventListener('click',()=>{
  payModal.classList.add('open');
  payModal.setAttribute('aria-hidden','false');
});
$('#closePay').addEventListener('click',()=>{
  payModal.classList.remove('open');
  payModal.setAttribute('aria-hidden','true');
});
$('#mockRazorpay').addEventListener('click',()=>showToast('Razorpay mock: Payment successful ✅'));
$('#mockPaytm').addEventListener('click',()=>showToast('Paytm mock: Payment successful ✅'));

// ---- Reservations: store locally + CSV export + inline success ----
const reserveForm = $('#reserveForm');
const reserveMsg = $('#reserveMsg');
const reserveSubmit = $('#reserveSubmit');
const bookings = JSON.parse(localStorage.getItem('leelasBookings')||'[]');

reserveForm.addEventListener('submit',e=>{
  e.preventDefault();
  reserveSubmit.disabled = true;
  const original = reserveSubmit.textContent;
  reserveSubmit.textContent = 'Submitting...';
  const data=Object.fromEntries(new FormData(reserveForm).entries());
  data.ts=new Date().toISOString();
  bookings.push(data);
  localStorage.setItem('leelasBookings',JSON.stringify(bookings));
  reserveForm.reset();
  reserveMsg.hidden = false;
  showToast('Reservation received!');
  setTimeout(()=>{
    reserveSubmit.disabled = false;
    reserveSubmit.textContent = original;
  }, 900);
});

$('#exportCSV').addEventListener('click',()=>{
  const arr=JSON.parse(localStorage.getItem('leelasBookings')||'[]');
  if(!arr.length){showToast('No reservations found');return}
  const headers=Object.keys(arr[0]);
  const csv=[headers.join(','),...arr.map(o=>headers.map(h=>`"${String(o[h]||'').replaceAll('"','""')}"`).join(','))].join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='leelas_reservations.csv';
  a.click();
});

// ---- Toast ----
function showToast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove('show'), 2400);
}
window.showToast = showToast;

// On load: apply filters (to ensure current active category respected on initial search state)
applyFilters();
