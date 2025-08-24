// ===============
// NEXOMEC JS
// ===============

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Slider
(function slider(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.querySelector('.dots');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  if(!slides.length) return;

  // Build dots
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.className = 'dot';
    b.setAttribute('role','tab');
    b.setAttribute('aria-label',`Ir al slide ${i+1}`);
    b.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let i = 0, t;
  function go(n){
    slides[i].classList.remove('is-active');
    dots[i].setAttribute('aria-selected','false');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    dots[i].setAttribute('aria-selected','true');
  }
  function nextSlide(){ go(i+1) }
  function prevSlide(){ go(i-1) }
  function play(){ t = setInterval(nextSlide, 5000) }
  function stop(){ clearInterval(t) }

  // init
  slides[0].classList.add('is-active');
  dots[0].setAttribute('aria-selected','true');
  play();

  next.addEventListener('click', ()=>{ stop(); nextSlide(); play(); });
  prev.addEventListener('click', ()=>{ stop(); prevSlide(); play(); });

  // swipe
  let sx = 0;
  const el = document.querySelector('.slider');
  if(el){
    el.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; stop(); }, {passive:true});
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - sx;
      if (dx > 40) prevSlide(); else if (dx < -40) nextSlide();
      play();
    }, {passive:true});
  }
})();

// Scroll reveal & shrink/expand
const inView = (el, ratio=0.2) => {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const topVisible = rect.top <= vh*(1-ratio);
  const bottomAbove = rect.bottom < 0;
  return topVisible && !bottomAbove;
}

const observed = document.querySelectorAll('.fade-up, .reveal, .shrink-on-hide');
function updateVis(){
  observed.forEach(el=>{
    if(inView(el, 0.18)){
      el.classList.add('in-view');
      el.classList.remove('is-hidden');
    } else {
      if(el.classList.contains('shrink-on-hide')){
        el.classList.add('is-hidden');
        el.classList.remove('in-view');
      }
    }
  });
}
['scroll','resize','load'].forEach(evt=>window.addEventListener(evt, updateVis, {passive:true}));
updateVis();

// Smooth hash navigation offset (account sticky header)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({top:y, behavior:'smooth'});
      if(menu.classList.contains('is-open')) menu.classList.remove('is-open');
    }
  });
});

// =======================
// EmailJS (Contact Form)
// =======================
(function() {
  emailjs.init("KOU5GgbXAcelEqFaP"); 
})();

const contactForm = document.getElementById("contact-form");
if(contactForm){
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm("service_q66aytu", "template_ow6np1k", this)
        .then(() => {
            alert("✅ Mensaje enviado con éxito. ¡Te responderemos pronto!");
            contactForm.reset();
        }, (err) => {
            alert("❌ Error al enviar: " + JSON.stringify(err));
        });
  });
}
