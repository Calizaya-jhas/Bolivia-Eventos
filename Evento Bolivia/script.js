const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let toastTimer;
function showToast(msg){
  toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2800);
}

const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('solid', window.scrollY > 60);
});

const burger = document.getElementById('burgerBtn');
const navList = document.getElementById('navList');
burger.addEventListener('click', ()=> navList.classList.toggle('open'));
navList.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=> navList.classList.remove('open'));
});

const taglines = [
  'Momentos únicos que se vuelven inolvidables',
  'Donde cada celebración lleva el alma de Bolivia',
  'Bodas, fiestas y encuentros con sabor a hogar',
  'Orgullosamente bolivianos'
];
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const taglineEl = document.getElementById('heroTagline');
let heroIndex = 0;
let heroTimer;

function showHeroSlide(i){
  slides.forEach(s=> s.classList.remove('active'));
  dots.forEach(d=> d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
  taglineEl.style.opacity = 0;
  setTimeout(()=>{
    taglineEl.textContent = taglines[i % taglines.length];
    taglineEl.style.opacity = 1;
  }, 300);
  heroIndex = i;
}

function nextHeroSlide(){ showHeroSlide((heroIndex + 1) % slides.length); }
function prevHeroSlide(){ showHeroSlide((heroIndex - 1 + slides.length) % slides.length); }

function startHeroAuto(){
  heroTimer = setInterval(nextHeroSlide, 6000);
}
function stopHeroAuto(){
  clearInterval(heroTimer);
}

document.getElementById('heroNext').addEventListener('click', ()=>{ nextHeroSlide(); stopHeroAuto(); startHeroAuto(); });
document.getElementById('heroPrev').addEventListener('click', ()=>{ prevHeroSlide(); stopHeroAuto(); startHeroAuto(); });
dots.forEach((dot, i)=> dot.addEventListener('click', ()=>{ showHeroSlide(i); stopHeroAuto(); startHeroAuto(); }));

const heroSection = document.querySelector('.hero');
heroSection.addEventListener('mouseenter', stopHeroAuto);
heroSection.addEventListener('mouseleave', startHeroAuto);

taglineEl.style.transition = 'opacity .3s ease';
taglineEl.textContent = taglines[0];
startHeroAuto();

document.querySelectorAll('.space-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const more = btn.parentElement.querySelector('.space-more');
    const isOpen = more.classList.toggle('open');
    btn.textContent = isOpen ? 'Ver menos' : 'Ver más';
  });
});

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lbIndex = 0;

function openLightbox(i){
  lbIndex = i;
  lightboxImg.src = galleryItems[i].src;
  lightboxImg.alt = galleryItems[i].alt;
  lightbox.classList.add('show');
}
function closeLightbox(){ lightbox.classList.remove('show'); }
function lbNext(){ lbIndex = (lbIndex + 1) % galleryItems.length; lightboxImg.src = galleryItems[lbIndex].src; lightboxImg.alt = galleryItems[lbIndex].alt; }
function lbPrev(){ lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length; lightboxImg.src = galleryItems[lbIndex].src; lightboxImg.alt = galleryItems[lbIndex].alt; }

galleryItems.forEach((img, i)=> img.addEventListener('click', ()=> openLightbox(i)));
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxNext').addEventListener('click', lbNext);
document.getElementById('lightboxPrev').addEventListener('click', lbPrev);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('show')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowRight') lbNext();
  if(e.key === 'ArrowLeft') lbPrev();
});

const numeroWhatsApp = '5491154616975';

const EMAILJS_PUBLIC_KEY = 'A0R0XdZE7cT5k5x7y';
const EMAILJS_SERVICE_ID = 'service_gzuim9t';
const EMAILJS_TEMPLATE_ID = 'template_e6uts6b';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function leerFormulario(){
  return {
    nombre: document.getElementById('fName').value,
    correo: document.getElementById('fEmail').value,
    telefono: document.getElementById('fPhone').value,
    tipo: document.getElementById('fType').value,
    fecha: document.getElementById('fDate').value,
    invitados: document.getElementById('fGuests').value,
    mensaje: document.getElementById('fMsg').value
  };
}

function formularioValido(datos){
  return datos.nombre && datos.correo && datos.telefono && datos.tipo;
}

function construirTextoWhatsApp(d){
  let texto = `Hola! Quiero consultar sobre un evento:\n\n`;
  texto += `*Nombre:* ${d.nombre}\n`;
  texto += `*Correo:* ${d.correo}\n`;
  texto += `*Teléfono:* ${d.telefono}\n`;
  texto += `*Tipo de evento:* ${d.tipo}\n`;
  if (d.fecha) texto += `*Fecha estimada:* ${d.fecha}\n`;
  if (d.invitados) texto += `*N° de invitados:* ${d.invitados}\n`;
  if (d.mensaje) texto += `*Mensaje:* ${d.mensaje}\n`;
  return texto;
}

function construirMensajeEmail(d){
  let cuerpo = `Nuevo pedido de consulta desde la web de Eventos Bolivia.\n\n`;
  cuerpo += `Correo de contacto: ${d.correo}\n`;
  cuerpo += `Teléfono: ${d.telefono}\n`;
  cuerpo += `Tipo de evento: ${d.tipo}\n`;
  if (d.fecha) cuerpo += `Fecha estimada: ${d.fecha}\n`;
  if (d.invitados) cuerpo += `N° de invitados: ${d.invitados}\n`;
  if (d.mensaje) cuerpo += `Mensaje: ${d.mensaje}\n`;
  return cuerpo;
}

function limpiarFormulario(){
  document.getElementById('contactForm').reset();
}

document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const datos = leerFormulario();

  if(!formularioValido(datos)){
    showToast('Completá nombre, correo, teléfono y tipo de evento.');
    return;
  }

  const texto = construirTextoWhatsApp(datos);
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');

  document.getElementById('formConfirm').classList.add('show');
  showToast('Te estamos redirigiendo a WhatsApp...');
  limpiarFormulario();
});

const sendEmailBtn = document.getElementById('sendEmailBtn');

sendEmailBtn.addEventListener('click', ()=>{
  const datos = leerFormulario();

  if(!formularioValido(datos)){
    showToast('Completá nombre, correo, teléfono y tipo de evento.');
    return;
  }

  const templateParams = {
    name: datos.nombre,
    time: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
    message: construirMensajeEmail(datos)
  };

  const textoOriginal = sendEmailBtn.textContent;
  sendEmailBtn.textContent = 'Enviando...';
  sendEmailBtn.disabled = true;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(()=>{
      document.getElementById('formConfirm').classList.add('show');
      showToast('✓ Consulta enviada por correo con éxito.');
      limpiarFormulario();
    })
    .catch((error)=>{
      console.error('Error EmailJS:', error);
      showToast('No se pudo enviar el correo. Probá con WhatsApp.');
    })
    .finally(()=>{
      sendEmailBtn.textContent = textoOriginal;
      sendEmailBtn.disabled = false;
    });
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el=> revealObserver.observe(el));