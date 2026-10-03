const products=[
{id:1,name:"Chocolate con queso",category:"Cafés",price:6000,emoji:"☕🧀",desc:"Chocolate caliente acompañado de queso, perfecto para una mañana bogotana.",featured:true},
{id:2,name:"Tamal",category:"Desayunos",price:8000,emoji:"🌿",desc:"Tamal tradicional servido calientico.",featured:true},
{id:3,name:"Pandebono",category:"Panadería",price:2500,emoji:"🥯",desc:"Recién horneado y con ese sabor de panadería de barrio.",featured:true},
{id:4,name:"Empanada",category:"Comidas",price:2000,emoji:"🥟",desc:"Empanada crujiente, ideal para cualquier momento.",featured:true},
{id:5,name:"Almojábana",category:"Panadería",price:2500,emoji:"🧀🥖",desc:"Suavecita por dentro y recién salida del horno.",featured:true},
{id:6,name:"Torta de chocolate",category:"Postres",price:5000,emoji:"🍫",desc:"Porción de torta de chocolate casera.",featured:true},
{id:7,name:"Huevos con arepa",category:"Desayunos",price:7000,emoji:"🍳🫓",desc:"Huevos preparados al gusto con arepa.",featured:false},
{id:8,name:"Caldo de costilla",category:"Desayunos",price:9000,emoji:"🍲",desc:"Caldito caliente para comenzar el día.",featured:false},
{id:9,name:"Café con leche",category:"Cafés",price:4000,emoji:"☕🥛",desc:"Café recién preparado con leche.",featured:false},
{id:10,name:"Aromática",category:"Cafés",price:3500,emoji:"🍵",desc:"Bebida caliente y suave para acompañar tu pan.",featured:false},
{id:11,name:"Sándwich de pollo",category:"Comidas",price:9500,emoji:"🥪",desc:"Sándwich preparado al momento.",featured:false},
{id:12,name:"Arepa con queso",category:"Comidas",price:6000,emoji:"🫓🧀",desc:"Arepa calientica con queso.",featured:false},
{id:13,name:"Almuerzo del día",category:"Almuerzos",price:16000,emoji:"🍛",desc:"Sopa, principio, proteína, arroz y bebida.",featured:false},
{id:14,name:"Arroz con pollo",category:"Almuerzos",price:15000,emoji:"🍗🍚",desc:"Un clásico casero para el almuerzo.",featured:false},
{id:15,name:"Arroz con leche",category:"Postres",price:5000,emoji:"🍚",desc:"Postre tradicional hecho en casa.",featured:false},
{id:16,name:"Torta de zanahoria",category:"Postres",price:5500,emoji:"🍰",desc:"Torta suave con sabor casero.",featured:false},
{id:17,name:"Jugo natural",category:"Bebidas",price:5500,emoji:"🧃",desc:"Jugo preparado con fruta.",featured:false},
{id:18,name:"Limonada",category:"Bebidas",price:5000,emoji:"🍋",desc:"Limonada fresca y preparada al momento.",featured:false}
];

const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
let cart=JSON.parse(localStorage.getItem("panaderiaCart")||"[]");
const grid=document.querySelector("#productGrid"), featuredGrid=document.querySelector("#featuredGrid"), label=document.querySelector("#filterLabel");

function productCard(p){
return `<article class="product-card">
<div class="food" data-detail="${p.id}">${p.emoji}</div>
<div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p>
<div class="product-row"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button></div></div></article>`;
}
function renderProducts(filter="Todos"){
const list=filter==="Todos"?products:products.filter(p=>p.category===filter);
label.textContent=filter==="Todos"?"Todos los productos":filter;
grid.innerHTML=list.map(productCard).join("");
bindProducts();
}
function renderFeatured(){
featuredGrid.innerHTML=products.filter(p=>p.featured).map(p=>`<article><div class="food">${p.emoji}</div><h3>${p.name}</h3><label>${money(p.price)}</label></article>`).join("");
}
function bindProducts(){
document.querySelectorAll("[data-add]").forEach(b=>b.onclick=e=>{addToCart(+e.currentTarget.dataset.add);});
document.querySelectorAll("[data-detail]").forEach(b=>b.onclick=e=>openDetail(+e.currentTarget.dataset.detail));
}
function addToCart(id){
const p=products.find(x=>x.id===id), item=cart.find(x=>x.id===id);
if(item)item.qty++;else cart.push({id,qty:1});
saveCart();openCart();showToast(`${p.name} agregado al pedido ❤️`);
}
function saveCart(){localStorage.setItem("panaderiaCart",JSON.stringify(cart));renderCart();}
function renderCart(){
const items=document.querySelector("#cartItems"),empty=document.querySelector("#cartEmpty"),total=document.querySelector("#cartTotal");
if(!cart.length){items.innerHTML="";empty.style.display="block";total.textContent=money(0);}
else{
empty.style.display="none";
items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item">
<div class="mini-food">${p.emoji}</div><div><h4>${p.name}</h4><p>${money(p.price*i.qty)}</p>
<div class="qty"><button data-dec="${p.id}">−</button><b>${i.qty}</b><button data-inc="${p.id}">+</button></div></div>
<button class="remove" data-remove="${p.id}">Eliminar</button></div>`}).join("");
const totalValue=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);total.textContent=money(totalValue);
items.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.inc,1));
items.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.dec,-1));
items.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeItem(+b.dataset.remove));
}
document.querySelector("#cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function openCart(){document.querySelector("#cartPanel").classList.add("open");document.querySelector("#cartBackdrop").classList.add("open");}
function closeCart(){document.querySelector("#cartPanel").classList.remove("open");document.querySelector("#cartBackdrop").classList.remove("open");}
function openDetail(id){
const p=products.find(x=>x.id===id);document.querySelector("#detailContent").innerHTML=`<div class="detail-food">${p.emoji}</div><h2>${p.name}</h2><p>${p.desc}</p><span class="detail-price">${money(p.price)}</span><button class="detail-add" onclick="addToCart(${p.id});closeDetail()">Agregar al pedido</button>`;
document.querySelector("#detailModal").classList.add("open");document.querySelector("#detailBackdrop").classList.add("open");
}
function closeDetail(){document.querySelector("#detailModal").classList.remove("open");document.querySelector("#detailBackdrop").classList.remove("open");}
function showToast(text){const t=document.querySelector("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}

document.querySelectorAll(".cats button").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".cats button").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");renderProducts(btn.dataset.filter);document.querySelector("#menu").scrollIntoView({behavior:"smooth"});});
document.querySelector("#clearFilter").onclick=()=>{document.querySelectorAll(".cats button").forEach(x=>x.classList.remove("selected"));renderProducts();};
document.querySelector("#viewAll").onclick=()=>renderProducts();
document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#cartBackdrop").onclick=closeCart;
document.querySelector("#detailClose").onclick=closeDetail;
document.querySelector("#detailBackdrop").onclick=closeDetail;
document.querySelector("#galleryBtn").onclick=()=>showToast("Aquí podremos agregar la galería real del restaurante.");
document.querySelector("#orderButton").onclick=()=>{
if(!cart.length){showToast("Agrega productos antes de preparar tu pedido.");return;}
const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${i.qty} x ${p.name} — ${money(p.price*i.qty)}`}).join("\n");
const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
alert(`PEDIDO DE PRUEBA\n\n${lines}\n\nTOTAL: ${money(total)}\n\nEn la versión final conectaremos este botón con WhatsApp.`);
};

const nav=document.querySelector("nav"),hamb=document.querySelector(".hamb");
hamb.onclick=()=>nav.classList.toggle("open");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));

renderProducts();renderFeatured();renderCart();
