(function () {
"use strict";
document.documentElement.classList.add("js");
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var glow = document.getElementById("pointer-glow");
var dot = document.getElementById("pointer-dot");
var tx = window.innerWidth / 2, ty = window.innerHeight / 3;
var gx = tx, gy = ty;
var dx = tx, dy = ty;
if (glow && dot && !reduce) {
window.addEventListener("pointermove", function (e) {
tx = e.clientX; ty = e.clientY;
glow.classList.add("on");
dot.classList.add("on");
});
window.addEventListener("pointerleave", function () {
glow.classList.remove("on");
dot.classList.remove("on");
});
(function loop() {
gx += (tx - gx) * 0.075;
gy += (ty - gy) * 0.075;
dx += (tx - dx) * 0.28;
dy += (ty - dy) * 0.28;
glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
requestAnimationFrame(loop);
})();
}
document.querySelectorAll(".card").forEach(function (card) {
card.addEventListener("pointermove", function (e) {
var r = card.getBoundingClientRect();
card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
});
});
var items = document.querySelectorAll(".reveal");
if (!reduce && "IntersectionObserver" in window) {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (en.isIntersecting) {
en.target.classList.add("in");
io.unobserve(en.target);
}
});
}, { threshold: 0.01, rootMargin: "0px 0px -40px 0px" });
items.forEach(function (el, i) {
el.style.transitionDelay = (i % 4) * 0.06 + "s";
io.observe(el);
});
} else {
items.forEach(function (el) { el.classList.add("in"); });
}
window.setTimeout(function () {
var vh = window.innerHeight || document.documentElement.clientHeight || 900;
document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
var r = el.getBoundingClientRect();
if (r.top < vh && r.bottom > 0) { el.classList.add("in"); }
});
}, 2500);
function animateCount(el) {
var target = parseFloat(el.getAttribute("data-count") || "0");
var suffix = el.getAttribute("data-suffix") || "";
var decimals = (el.getAttribute("data-decimals") | 0);
var t0 = performance.now(), dur = 1200;
if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }
(function step(now) {
var p = Math.min(1, (now - t0) / dur);
var eased = 1 - Math.pow(1 - p, 3);
el.textContent = (target * eased).toFixed(decimals) + suffix;
if (p < 1) requestAnimationFrame(step);
})(t0);
}
var counters = document.querySelectorAll("[data-count]");
if (counters.length && "IntersectionObserver" in window) {
var cio = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
});
}, { threshold: 0.5 });
counters.forEach(function (el) { cio.observe(el); });
} else {
counters.forEach(animateCount);
}
var burger = document.querySelector(".burger");
var links = document.querySelector("nav.links");
if (burger && links) {
burger.addEventListener("click", function () { links.classList.toggle("open"); });
links.querySelectorAll("a").forEach(function (a) {
a.addEventListener("click", function () { links.classList.remove("open"); });
});
}
if (!reduce) {
document.querySelectorAll("[data-tilt]").forEach(function (el) {
el.addEventListener("pointermove", function (e) {
var r = el.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
el.style.transform = "perspective(900px) rotateY(" + (px * 10) +
"deg) rotateX(" + (-py * 10) + "deg)";
});
el.addEventListener("pointerleave", function () { el.style.transform = ""; });
});
}
var agree = document.getElementById("agree-terms");
var hint = document.getElementById("agree-hint");
var gated = [];
if (agree) {
var box = agree.closest(".download-box") || agree.parentNode;
gated = box ? box.querySelectorAll("[data-download]") : [];
}
function syncAgree() {
var ok = !agree || agree.checked;
Array.prototype.forEach.call(gated, function (btn) {
btn.classList.toggle("is-locked", !ok);
btn.setAttribute("aria-disabled", ok ? "false" : "true");
});
if (hint) {
hint.classList.toggle("ok", ok);
hint.textContent = ok
? "Условия приняты — можно скачивать."
: "Поставьте галочку — и кнопка скачивания станет активной.";
}
}
if (agree) {
agree.addEventListener("change", syncAgree);
syncAgree();
}
document.querySelectorAll("[data-download]").forEach(function (btn) {
btn.addEventListener("click", function (event) {
if (agree && !agree.checked) {
event.preventDefault();
if (hint) { hint.scrollIntoView({ block: "center", behavior: "smooth" }); }
agree.focus();
return;
}
var kids = Array.prototype.slice.call(btn.childNodes);
btn.textContent = "Готовим файл…";
btn.style.pointerEvents = "none";
setTimeout(function () {
if (typeof btn.replaceChildren === "function") {
btn.replaceChildren.apply(btn, kids);
}
btn.style.pointerEvents = "";
}, 900);
});
});
var y = document.getElementById("year");
if (y) y.textContent = String(new Date().getFullYear());
})();