/* ============================= */
/* MENU HOVER NAVBAR */
/* ============================= */

const menuLinks = document.querySelectorAll(".menu a");
const defaultActive = document.querySelector(".menu a.active");

menuLinks.forEach(link => {

link.addEventListener("mouseenter", () => {
menuLinks.forEach(l => l.classList.remove("active"));
link.classList.add("active");
});

link.addEventListener("mouseleave", () => {
menuLinks.forEach(l => l.classList.remove("active"));
if(defaultActive){
defaultActive.classList.add("active");
}
});

});

/* ============================= */
/* SIDEBAR */
/* ============================= */

const sidebar = document.getElementById("sidebar");
const hamburger = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".close-btn");

/* abrir sidebar */

if(hamburger){
hamburger.addEventListener("click", function(){
sidebar.classList.add("active");
});
}

/* cerrar sidebar */

if(closeBtn){
closeBtn.addEventListener("click", function(){
sidebar.classList.remove("active");
});
}

/* cerrar al hacer click fuera */

document.addEventListener("click", function(event){

if(!sidebar) return;

const isClickInside = sidebar.contains(event.target);
const isHamburger = event.target.closest(".hamburger");

if(!isClickInside && !isHamburger){
sidebar.classList.remove("active");
}

});

/* ============================= */
/* FUNCION GENERICA PARA BANNERS */
/* ============================= */

function createBanner(images, slidesId, dotsId){

let index = 0;

const slidesContainer = document.getElementById(slidesId);
const dotsContainer = document.getElementById(dotsId);

if(!slidesContainer || !dotsContainer) return;

let slides = [];
let dots = [];

/* CREAR SLIDES Y DOTS */

images.forEach((img, i) => {

const slide = document.createElement("div");
slide.classList.add("slide");

if(i === 0){
slide.classList.add("active");
}

/* IMAGEN */

const image = document.createElement("img");
image.src = img;

slide.appendChild(image);

slidesContainer.appendChild(slide);
slides.push(slide);

/* DOT */

const dot = document.createElement("span");
dot.classList.add("dot");

if(i === 0){
dot.classList.add("active");
}

dot.addEventListener("click", () => {
index = i;
updateSlides();
});

dotsContainer.appendChild(dot);
dots.push(dot);

});

/* ACTUALIZAR SLIDE */

function updateSlides(){

slides.forEach(s => s.classList.remove("active"));
dots.forEach(d => d.classList.remove("active"));

slides[index].classList.add("active");
dots[index].classList.add("active");

}

}

/* ============================= */
/* BANNER 1 */
/* ============================= */

const banner1Images = [
"../img/banner1/image1.png",
"../img/banner1/image2.png",
"../img/banner1/image3.png"
];

createBanner(banner1Images,"banner1-slides","banner1-dots");

/* ============================= */
/* BANNER 2 */
/* ============================= */

const banner2Images = [
"../img/banner2/image1.png",
"../img/banner2/image2.png",
"../img/banner2/image3.png"
];

createBanner(banner2Images,"banner2-slides","banner2-dots");
