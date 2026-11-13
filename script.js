const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive", "Food"];
const products = [
  {id:1,name:"Wireless Bluetooth Headphones",price:79.99,originalPrice:99.99,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=500&fit=crop",rating:4.5,reviews:1247,seller:"TechGear Pro",trust:92,category:"Electronics"},
  {id:2,name:"Premium Cotton T-Shirt",price:24.99,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=500&fit=crop",rating:4.3,reviews:856,seller:"Fashion Forward",trust:85,category:"Clothing"},
  {id:3,name:"Smart Home Security Camera",price:149.99,originalPrice:199.99,image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",rating:4.7,reviews:2103,seller:"SecureHome Tech",trust:96,category:"Electronics"},
  {id:4,name:"Organic Coffee Beans 2lb",price:18.99,image:"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=500&fit=crop",rating:4.6,reviews:743,seller:"Mountain Roasters",trust:89,category:"Food"},
  {id:5,name:"Yoga Mat Premium Quality",price:39.99,image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=500&fit=crop",rating:4.4,reviews:512,seller:"FitLife Essentials",trust:83,category:"Sports"},
  {id:6,name:"LED Desk Lamp with USB Charging",price:34.99,originalPrice:49.99,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=500&fit=crop",rating:4.2,reviews:328,seller:"Office Solutions",trust:78,category:"Home & Garden"}
];
const cart = new Map();
const selectedCategories = new Set();
const grid = document.querySelector("#product-grid");
const toast = document.querySelector("#toast");
let toastTimer;
const money = n => `$${n.toFixed(2)}`;
function renderFilters(){
  document.querySelector("#categories").innerHTML = categories.map(c=>`<label class="check-row"><input type="checkbox" value="${c}" class="category-filter">${c}</label>`).join("");
  document.querySelector("#ratings").innerHTML = [4,3,2,1].map(n=>`<label class="check-row"><input type="checkbox" value="${n}" class="rating-filter"><span>${"★".repeat(n)}${"☆".repeat(5-n)} &amp; up</span></label>`).join("");
}
function trustClass(score){return score>=90?"good":score>=80?"blue":"amber"}
function filteredProducts(){
  const query=document.querySelector("#search-input").value.trim().toLowerCase();
  const max=Number(document.querySelector("#price-range").value), minTrust=Number(document.querySelector("#trust-range").value);
  const minRating=Math.max(0,...[...document.querySelectorAll(".rating-filter:checked")].map(x=>Number(x.value)));
  let list=products.filter(p=>(!selectedCategories.size||selectedCategories.has(p.category))&&p.price<=max&&p.trust>=minTrust&&p.rating>=minRating&&(!query||`${p.name} ${p.seller} ${p.category}`.toLowerCase().includes(query)));
  const sort=document.querySelector("#sort-select").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price); if(sort==="rating")list.sort((a,b)=>b.rating-a.rating); if(sort==="trust")list.sort((a,b)=>b.trust-a.trust);
  return list;
}
function renderProducts(){
  const list=filteredProducts();
  document.querySelector("#result-count").textContent=`1–${list.length} of ${list.length} results`;
  document.querySelector("#empty-state").hidden=Boolean(list.length);
  grid.innerHTML=list.map(p=>`<article class="product-card"><a class="card-link" href="./product-detail.html" aria-label="View ${p.name} details" style="display:block;text-decoration:none;color:inherit"><div class="image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">${p.originalPrice?`<span class="sale-tag">Save ${money(p.originalPrice-p.price)}</span>`:""}</div><h2>${p.name}</h2></a><div class="rating" aria-label="Rated ${p.rating} out of 5">${"★".repeat(Math.floor(p.rating))}${p.rating%1?"☆":""}<span class="rating-count">(${p.reviews.toLocaleString()})</span></div><div class="price-line"><span class="price">${money(p.price)}</span>${p.originalPrice?`<span class="old-price">${money(p.originalPrice)}</span>`:""}</div><div class="seller">by <span>${p.seller}</span></div><div class="trust ${trustClass(p.trust)}"><div><span class="trust-label">Trust Score</span> <strong>${p.trust}%</strong><div class="trust-bar"><span style="width:${p.trust}%"></span></div></div><span>${p.trust>=90?"Excellent":p.trust>=80?"Very Good":"Good"}</span></div><button class="add-button" data-add="${p.id}">Add to Cart</button></article>`).join("");
}
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2100)}
function renderCart(){
  const entries=[...cart.entries()];
  document.querySelector("#cart-count").textContent=entries.reduce((n,[,q])=>n+q,0);
  document.querySelector("#cart-items").innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>x.id===id);return `<div class="cart-line"><span>${p.name} × ${q}</span><span>${money(p.price*q)} <button data-remove="${id}" aria-label="Remove ${p.name}">Remove</button></span></div>`}).join(""):"<p>Your cart is empty.</p>";
  document.querySelector("#cart-total").textContent=money(entries.reduce((total,[id,q])=>total+products.find(p=>p.id===id).price*q,0));
}
renderFilters();renderProducts();renderCart();
document.querySelector("#search-form").addEventListener("submit",e=>{e.preventDefault();renderProducts()});
document.querySelector("#search-input").addEventListener("input",renderProducts);
document.querySelector("#categories").addEventListener("change",e=>{if(e.target.matches(".category-filter")){e.target.checked?selectedCategories.add(e.target.value):selectedCategories.delete(e.target.value);renderProducts()}});
document.querySelector("#ratings").addEventListener("change",renderProducts);
document.querySelector("#price-range").addEventListener("input",e=>{document.querySelector("#max-label").textContent=e.target.value;renderProducts()});
document.querySelector("#trust-range").addEventListener("input",e=>{document.querySelector("#trust-label").textContent=`${e.target.value}%`;renderProducts()});
document.querySelector("#sort-select").addEventListener("change",renderProducts);
grid.addEventListener("click",e=>{const button=e.target.closest("[data-add]");if(button){const id=Number(button.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();notify(`${products.find(p=>p.id===id).name} added to cart`)}});
document.querySelector("#cart-items").addEventListener("click",e=>{const button=e.target.closest("[data-remove]");if(button){cart.delete(Number(button.dataset.remove));renderCart()}});
document.querySelector("#cart-toggle").addEventListener("click",()=>document.querySelector("#cart-dialog").showModal());
document.querySelector("#close-cart").addEventListener("click",()=>document.querySelector("#cart-dialog").close());
document.querySelector("#checkout-button").addEventListener("click",()=>notify("Checkout demo — connect a payment service to accept orders"));
document.querySelector("#account-button").addEventListener("click",()=>notify("Account sign-in is not included in this static demo"));
document.querySelector("#load-more").addEventListener("click",()=>notify("You are viewing all available demo products"));
document.querySelector("#menu-toggle").addEventListener("click",e=>{const panel=document.querySelector("#filters");panel.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",panel.classList.contains("open"))});
document.querySelector("#clear-filters").addEventListener("click",()=>{selectedCategories.clear();document.querySelectorAll(".category-filter,.rating-filter").forEach(input=>input.checked=false);document.querySelector("#search-input").value="";document.querySelector("#price-range").value=500;document.querySelector("#max-label").textContent="500";document.querySelector("#trust-range").value=70;document.querySelector("#trust-label").textContent="70%";renderProducts()});
