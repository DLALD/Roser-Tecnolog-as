// DePie page scripts: sidebar menu + cart sync (copied behavior from site canonical files)
document.addEventListener('DOMContentLoaded', function() {
  addDePieStyles(); // Inyectar estilos del carrusel

  // Sidebar/menu toggle
  const menuButton = document.querySelector('.menu-button');
  const sidebarDropdown = document.querySelector('.sidebar-dropdown');
  const sectionHeaders = document.querySelectorAll('.section-header');

  if (menuButton && sidebarDropdown) {
    menuButton.addEventListener('click', function(e){
      e.stopPropagation();
      sidebarDropdown.classList.toggle('active');
    });
  }

  sectionHeaders.forEach(sectionHeader => {
    sectionHeader.setAttribute('tabindex', '0');
    sectionHeader.addEventListener('click', function(e){
      e.stopPropagation();
      const subsection = sectionHeader.nextElementSibling;
      const sectionArrow = sectionHeader.querySelector('.section-arrow');
      if (subsection) subsection.classList.toggle('active');
      if (sectionArrow) sectionArrow.style.transform = (subsection && subsection.classList.contains('active')) ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });

  // Apps and prototypes headers toggles (if present)
  document.querySelectorAll('.apps-header, .prototypes-header').forEach(h => {
    h.setAttribute('tabindex', '0');
    h.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      const next = h.nextElementSibling;
      if (next) next.classList.toggle('active');
      const arrow = h.querySelector('.section-arrow');
      if (arrow) arrow.style.transform = next && next.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e){
    if (sidebarDropdown && !menuButton.contains(e.target) && !sidebarDropdown.contains(e.target)) {
      sidebarDropdown.classList.remove('active');
    }
  });

  // Close sidebar when clicking a link
  document.querySelectorAll('.sidebar-dropdown a:not(.apps-header)').forEach(n => n.addEventListener('click', () => {
    if (sidebarDropdown) sidebarDropdown.classList.remove('active');
  }));

  // --- Cart implementation (sync with marketplace via localStorage) ---
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartCount() {
    const count = cart.reduce((s, it) => s + it.quantity, 0);
    const el = document.getElementById('shared-cart-count') || document.getElementById('cart-count');
    if (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function updateCartDisplay() {
    const cartBody = document.getElementById('cartBody');
    if (!cartBody) return;
    if (cart.length === 0) {
      cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
      const totalEl = document.getElementById('cart-total'); if (totalEl) totalEl.textContent = '$0 COP';
      return;
    }
    let html = '<div class="cart-items">';
    let total = 0;
    cart.forEach((item, idx) => {
      const itemTotal = (item.price || 0) * item.quantity;
      total += itemTotal;
      html += `
        <div class="cart-item">
          <img src="${item.image || ''}" alt="${item.name || ''}" class="cart-item-img">
          <div class="cart-item-details"><h4>${item.name}</h4><p class="cart-item-price">${item.price ? '$' + item.price.toLocaleString('es-CO') + ' COP' : 'Cotización'}</p></div>
          <div class="cart-item-quantity"><button onclick="decreaseQuantity(${idx})">-</button><span>${item.quantity}</span><button onclick="increaseQuantity(${idx})">+</button></div>
          <div class="cart-item-total">${item.price ? '$' + itemTotal.toLocaleString('es-CO') + ' COP' : 'Cotización'}</div>
          <button class="remove-item" onclick="removeFromCart(${idx})">&times;</button>
        </div>`;
    });
    html += '</div>';
    cartBody.innerHTML = html;
    // Resolve image URLs and add fallbacks for images that fail to load
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const upPrefix = pathParts.length > 1 ? '../'.repeat(pathParts.length - 1) : '';

    function resolveImageSrc(original) {
      if (!original) return '';
      try {
        // If absolute URL or data URI, return as-is
        if (/^(https?:|data:|file:)/i.test(original)) return original;
      } catch (e) {}

      // If original contains 'Marketplace/' segment, normalize to a relative path from current page
      const idx = original.indexOf('Marketplace/');
      if (idx !== -1) {
        const rest = original.substring(idx + 'Marketplace/'.length);
        return upPrefix + 'Marketplace/' + rest;
      }

      // If starts with a leading slash, treat as root-relative
      if (original.startsWith('/')) return original;

      // Default: return original (browser will try to resolve relative to this page)
      return original;
    }

    function attachFallbacks() {
      const imgs = cartBody.querySelectorAll('.cart-item-img');
      imgs.forEach((imgEl, i) => {
        const orig = imgEl.getAttribute('src') || '';
        const resolved = resolveImageSrc(orig);
        imgEl.src = resolved;

        imgEl.onerror = function() {
          // Try decodeURI
          try {
            const decoded = decodeURIComponent(orig);
            if (decoded !== orig) { imgEl.src = resolveImageSrc(decoded); return; }
          } catch (e) {}

          // Replace spaces with %20
          const enc = orig.replace(/ /g, '%20');
          if (enc !== orig) { imgEl.src = resolveImageSrc(enc); return; }

          // As last resort, try to find Marketplace file name and use upPrefix + path
          const mIdx = orig.indexOf('Marketplace');
          if (mIdx !== -1) {
            const rest = orig.substring(mIdx + 'Marketplace'.length);
            imgEl.src = upPrefix + 'Marketplace' + rest;
            return;
          }

          // Hide broken image visually
          imgEl.style.display = 'none';
        };
      });
    }

    attachFallbacks();
    const totalEl = document.getElementById('cart-total'); if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CO')} COP`;

    // Actualizar visualización del método de pago
    const paymentMethodLogos = {
        'Nequi': '../../Marketplace/metodos de pago/Nequi.png',
        'Daviplata': '../../Marketplace/metodos de pago/Daviplata.png',
        'Bancolombia': '../../Marketplace/metodos de pago/Bancolombia.png',
        'Efecty': '../../Marketplace/metodos de pago/Efecty.png',
        'Visa': '../../Marketplace/metodos de pago/Visa.png',
        'Mastercard': '../../Marketplace/metodos de pago/Mastercard.png',
        'PSE': '../../Marketplace/metodos de pago/PSE.png'
    };
    
    const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    const paymentContainer = document.getElementById('cartPaymentMethod');
    if (paymentContainer) {
        if(selectedPaymentMethod) {
            const logoSrc = paymentMethodLogos[selectedPaymentMethod];
            let paymentHtml = '<div style="display: flex; align-items: center; gap: 8px;">';
            if (logoSrc) {
                paymentHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
            }
            paymentHtml += `<span style="font-weight: bold; color: #333;">${selectedPaymentMethod}</span>`;
            paymentHtml += `<button class="remove-payment-btn" onclick="event.stopPropagation(); removePaymentMethod()" title="Quitar método de pago" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-weight: bold; font-size: 1.2rem; margin-left: 10px;">&times;</button>`;
            paymentHtml += '</div>';
            paymentContainer.innerHTML = paymentHtml;
        } else {
            paymentContainer.innerHTML = '<span style="color: #f57c00; cursor: pointer;" onclick="closeCartModal(); openPaymentModal();">No seleccionado (Clic para elegir)</span>';
        }
    }
  }

  window.addToCart = function(id, name, price, image) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, name, price, image, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); updateCartDisplay();
  };

  window.removeFromCart = function(index) { cart.splice(index,1); localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); updateCartDisplay(); };
  window.increaseQuantity = function(index){ cart[index].quantity++; localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); updateCartDisplay(); };
  window.decreaseQuantity = function(index){ if (cart[index].quantity>1){ cart[index].quantity--; localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); updateCartDisplay(); } };

  window.removePaymentMethod = function() {
      localStorage.removeItem('selectedPayment');
      updateCartDisplay();
  };

  window.openCartModal = function() { updateCartDisplay(); const modal = document.getElementById('cartModal'); if (window.$ && modal) $('#cartModal').show(); else if (modal) modal.style.display='block'; };
  window.closeCartModal = function() { const modal = document.getElementById('cartModal'); if (window.$ && modal) $('#cartModal').hide(); else if (modal) modal.style.display='none'; };

  window.checkout = function(){ 
    if (cart.length===0){ alert('Tu carrito está vacío'); return; } 
    const phone='573113579437'; 
    let message='¡Hola! Quiero realizar el siguiente pedido:\n\n'; 
    let total=0; 
    cart.forEach(item=>{ 
      const itemTotal=(item.price||0)*item.quantity; 
      total+=itemTotal; 
      message+=`• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP\n\n`; 
    }); 
    message+=`Total: $${total.toLocaleString('es-CO')} COP`; 
    
    const currentPaymentMethod = localStorage.getItem('selectedPayment') || '';
    message += currentPaymentMethod ? `\n\nMétodo de Pago: ${currentPaymentMethod}` : `\n\nMétodo de Pago: A convenir`;

    const url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`; 
    window.open(url,'_blank'); 
  };

  // Initialize
  updateCartCount(); updateCartDisplay();

  // React to localStorage changes from Marketplace or other pages
  window.addEventListener('storage', function(e){ 
      if (e.key==='cart'){ cart = JSON.parse(e.newValue) || []; updateCartCount(); updateCartDisplay(); } 
      if (e.key==='selectedPayment'){ updateCartDisplay(); }
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e){ const modal = document.getElementById('cartModal'); if (modal && e.target === modal) closeCartModal(); });

  // --- Navigation toggle for small screens ---
  const navToggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    // close nav when clicking outside
    document.addEventListener('click', function(ev){ if (!navList.contains(ev.target) && !navToggle.contains(ev.target)) navList.classList.remove('open'); });
  }

  // --- Gallery lightbox ---
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt){
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){ if (!lightbox) return; lightbox.setAttribute('aria-hidden','true'); lightboxImg.src=''; document.body.style.overflow = ''; }

  galleryThumbs.forEach(t => t.addEventListener('click', function(){ const src = t.dataset.full || t.src; openLightbox(src, t.alt); }));
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });

  // --- Carousel behavior ---
  const carousel = document.getElementById('depieCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const thumbsContainer = document.getElementById('carouselThumbs');
  const indicatorsContainer = document.getElementById('carouselIndicators');

  // Mover indicadores dentro del wrapper para que se ubiquen correctamente en el espacio reservado
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper && indicatorsContainer && indicatorsContainer.parentElement !== carouselWrapper) {
      carouselWrapper.appendChild(indicatorsContainer);
  }

  // Estilizar encabezado de la galería (Título y Descripción) y crear sección
  const carouselContainerEl = document.querySelector('.carousel-container');
  let galleryTitleEl = null;

  if (carouselContainerEl) {
      let el = carouselContainerEl.previousElementSibling;
      let foundTitle = false;
      // Buscar hacia atrás elementos P y H2/H3 para aplicar estilos
      for(let i=0; i<5 && el; i++) {
          if (el.tagName === 'P') el.classList.add('gallery-description');
          if (el.tagName === 'H2' || el.tagName === 'H3') {
              el.classList.add('gallery-title');
              galleryTitleEl = el;
              foundTitle = true;
          }
          if (foundTitle) break;
          el = el.previousElementSibling;
      }
      
      // Envolver en sección gris si se encontró el título
      if (galleryTitleEl && galleryTitleEl.parentNode) {
          const wrapper = document.createElement('div');
          wrapper.className = 'gallery-section';
          
          // Insertar wrapper antes del título
          galleryTitleEl.parentNode.insertBefore(wrapper, galleryTitleEl);
          
          // Mover elementos al wrapper (Título -> ... -> Carrusel)
          const nodesToMove = [];
          let curr = galleryTitleEl;
          // Recolectar nodos hasta llegar al carrusel (inclusive)
          while(curr && curr !== carouselContainerEl) {
              nodesToMove.push(curr);
              curr = curr.nextElementSibling;
          }
          nodesToMove.push(carouselContainerEl);
          
          nodesToMove.forEach(node => wrapper.appendChild(node));

          // Observer para animación de aparición
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      entry.target.classList.add('visible');
                      observer.unobserve(entry.target);
                  }
              });
          }, { threshold: 0.2 });
          observer.observe(galleryTitleEl);
      }
  }

  let currentIndex = 0;
  const slides = carousel ? Array.from(carousel.children) : [];
  let thumbsExpanded = false;
  let autoPlayInterval;

  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function renderThumbs(){
    // Ocultar contenedor de miniaturas
    if (thumbsContainer) {
        thumbsContainer.style.display = 'none';
        thumbsContainer.innerHTML = '';
    }

    if (indicatorsContainer) indicatorsContainer.innerHTML = '';

    // Render Indicators (All slides)
    if (indicatorsContainer) {
      slides.forEach((_, i) => {
      // Indicators
        const indicator = document.createElement('div');
        indicator.className = `progress-bar ${i===currentIndex ? 'active' : ''}`;
        indicator.innerHTML = '<div class="progress-fill"></div>';
        indicator.addEventListener('click', ()=>{ goToSlide(i); });
        indicatorsContainer.appendChild(indicator);
      });
    }
  }

  function updateCarousel(){
    if (!carousel) return;
    const w = carousel.clientWidth;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    // update thumbs
    const thumbs = thumbsContainer ? Array.from(thumbsContainer.children) : [];
    thumbs.forEach((t, i)=> {
      let isActive = i === currentIndex;
      // If current index is beyond visible thumbs, highlight the last one (the +N one)
      if (currentIndex >= thumbs.length && i === thumbs.length - 1) {
        isActive = true;
      }
      t.classList.toggle('active', isActive);
    });
    
    // update indicators
    const indicators = indicatorsContainer ? Array.from(indicatorsContainer.children) : [];
    indicators.forEach((ind, i)=> ind.classList.toggle('active', i===currentIndex));
  }

  function goToSlide(i){ 
    if (!slides.length) return; 
    currentIndex = (i+slides.length)%slides.length; 
    updateCarousel();
    startAutoPlay();
  }
  function nextSlide(){ goToSlide(currentIndex+1); }
  function prevSlide(){ goToSlide(currentIndex-1); }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Make slide open lightbox on click
  slides.forEach((s)=>{ const img = s.querySelector('img'); if (img) img.addEventListener('click', ()=> openLightbox(img.src, img.alt)); });

  // Initialize carousel
  renderThumbs(); updateCarousel(); startAutoPlay();

  // --- Video modal ---
  const openVideoBtn = document.getElementById('openVideoBtn') || document.getElementById('playVideoBtn');
  const videoModal = document.getElementById('videoModal');
  const videoModalPlayer = document.getElementById('videoModalPlayer');
  const videoModalClose = document.getElementById('videoModalClose');

  function openVideoModal(){ if (!videoModal) return; videoModal.setAttribute('aria-hidden','false'); try{ videoModalPlayer.currentTime = 0; videoModalPlayer.play(); }catch(e){} document.body.style.overflow='hidden'; }
  function closeVideoModal(){ if (!videoModal) return; videoModal.setAttribute('aria-hidden','true'); try{ videoModalPlayer.pause(); videoModalPlayer.currentTime = 0; }catch(e){} document.body.style.overflow=''; }

  if (openVideoBtn) openVideoBtn.addEventListener('click', function(e){ e.preventDefault(); openVideoModal(); });
  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModal) videoModal.addEventListener('click', function(e){ if (e.target === videoModal) closeVideoModal(); });

  // Global keyboard handler (Esc to close overlays)
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){
      // close lightbox if open
      if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
      if (videoModal && videoModal.getAttribute('aria-hidden') === 'false') closeVideoModal();
      if (document.getElementById('cartModal') && document.getElementById('cartModal').style.display === 'block') closeCartModal();
    }
  });

  // --- Floating WhatsApp widget initialization ---
  try {
    if (window.$ && typeof $.fn.floatingWhatsApp === 'function') {
      $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        popupMessage: 'Hola 👋\n¿En qué podemos ayudarte con DePie?',
        message: 'Hola, estoy interesado en el prototipo DePie.',
        showPopup: true,
        showOnIE: false,
        headerTitle: 'Chatea con Roser',
        headerColor: '#128C7E',
        backgroundColor: '#25D366',
        size: '60px',
        position: 'right',
        zIndex: 9999
      });
    } else if (document.getElementById('BotonWA')) {
      // Fallback: simple link button
      const btn = document.createElement('a');
      btn.href = 'https://wa.me/573113579437?text=' + encodeURIComponent('Hola, estoy interesado en DePie');
      btn.target = '_blank';
      btn.className = 'fallback-wa';
      btn.innerHTML = '<img src="../../Imagenes/whatsapp.png" alt="WhatsApp" style="width:44px;height:44px;border-radius:8px;">';
      document.getElementById('BotonWA').appendChild(btn);
    }
  } catch (err) {
    console.warn('WhatsApp widget init failed', err);
  }

  // --- Contact WhatsApp Button Handler ---
  const contactWhatsappBtn = document.getElementById('contactWhatsappBtn');
  if (contactWhatsappBtn) {
    contactWhatsappBtn.addEventListener('click', function() {
      const name = document.getElementById('contactName')?.value || '';
      const subject = document.getElementById('contactSubject')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const whatsappMessage = `Hola, estoy interesado en DePie.\n\nNombre: ${name}\nAsunto: ${subject}\nMensaje: ${message}`;
      const phone = '573113579437';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, '_blank');
    });
  }

  // --- Contact Form Handler ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;
      const whatsappMessage = `Hola, estoy interesado en DePie.\n\nNombre: ${name}\nAsunto: ${subject}\nMensaje: ${message}`;
      const phone = '573113579437';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, '_blank');
    });
  }

  // --- Estilizar botón de Galería (Solicitud: Icono y Estilo) ---
  const allLinks = document.querySelectorAll('a, button');
  let galleryBtn = null;
  for (let el of allLinks) {
      if (el.textContent && (el.textContent.trim().toLowerCase() === 'ver galería' || el.textContent.trim().toLowerCase() === 'ver galeria')) {
          galleryBtn = el;
          break;
      }
  }

  if (galleryBtn) {
      galleryBtn.style.display = "inline-flex";
      galleryBtn.style.alignItems = "center";
      galleryBtn.style.justifyContent = "center";
      galleryBtn.style.gap = "8px";
      galleryBtn.style.backgroundColor = "white"; 
      galleryBtn.style.color = "#1e88e5";
      galleryBtn.style.border = "2px solid #1e88e5";
      galleryBtn.style.padding = "12px 24px";
      galleryBtn.style.borderRadius = "50px";
      galleryBtn.style.textDecoration = "none";
      galleryBtn.style.fontWeight = "600";
      galleryBtn.style.fontSize = "1rem";
      galleryBtn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
      galleryBtn.style.transition = "all 0.3s ease";
      galleryBtn.style.cursor = "pointer";

      // Icono SVG de Galería
      galleryBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 16V4C22 2.9 21.1 2 20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16ZM11 12L13.03 14.71L16 11L20 16H8L11 12ZM2 6V20C2 21.1 2.9 22 4 22H18V20H4V6H2Z"/></svg> Ver Galería`;

      galleryBtn.onmouseover = () => {
          galleryBtn.style.backgroundColor = "#1e88e5";
          galleryBtn.style.color = "white";
          galleryBtn.style.transform = "translateY(-2px)";
          galleryBtn.style.boxShadow = "0 6px 20px rgba(30, 136, 229, 0.2)";
      };
      galleryBtn.onmouseout = () => {
          galleryBtn.style.backgroundColor = "white";
          galleryBtn.style.color = "#1e88e5";
          galleryBtn.style.transform = "translateY(0)";
          galleryBtn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
      };
      
      // Scroll suave a la galería
      galleryBtn.addEventListener('click', (e) => {
          const target = document.querySelector('.gallery-section') || document.querySelector('.carousel-container');
          if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      });
  }

  // --- Inject WhatsApp Info Button (Solicitud: 3er botón verde con icono) ---
  const videoBtn = document.getElementById('openVideoBtn') || document.getElementById('playVideoBtn');
  if (videoBtn && videoBtn.parentNode) {
      // Crear el botón
      const waBtn = document.createElement('a');
      waBtn.href = "#contactForm";
      waBtn.className = "btn-whatsapp-info";
      waBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const contactSection = document.getElementById('contactForm');
          if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      });
      
      // Estilos en línea para asegurar el diseño solicitado (verde, icono, texto)
      waBtn.style.display = "inline-flex";
      waBtn.style.alignItems = "center";
      waBtn.style.justifyContent = "center";
      waBtn.style.gap = "8px";
      waBtn.style.backgroundColor = "#1e88e5"; // Color Azul Tema
      waBtn.style.color = "white";
      waBtn.style.padding = "12px 24px";
      waBtn.style.borderRadius = "50px";
      waBtn.style.textDecoration = "none";
      waBtn.style.fontWeight = "600";
      waBtn.style.fontSize = "1rem";
      waBtn.style.marginLeft = "15px"; // Separación de los otros botones
      waBtn.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.3)";
      waBtn.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      waBtn.style.cursor = "pointer";
      
      // Efecto Hover
      waBtn.onmouseover = () => {
          waBtn.style.transform = "translateY(-2px)";
          waBtn.style.boxShadow = "0 6px 20px rgba(30, 136, 229, 0.5)";
      };
      waBtn.onmouseout = () => {
          waBtn.style.transform = "translateY(0)";
          waBtn.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.3)";
      };

      // Icono SVG de Formulario + Texto
      waBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"/></svg> Información`;

      // Insertar después del botón de video (o al final del contenedor)
      videoBtn.parentNode.insertBefore(waBtn, videoBtn.nextSibling);
  }

});

function addDePieStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos inyectados para DePie (basados en Diseño 3D) */
        .carousel-container {
            position: relative;
            max-width: 100%;
            margin: 0 auto;
            display: flex;
            gap: 2rem;
            align-items: flex-start;
        }
        
        /* Barra lateral de miniaturas */
        #carouselThumbs {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            width: 100px;
            flex-shrink: 0;
            max-height: 500px;
            overflow-y: auto;
            scrollbar-width: none;
        }
        
        #carouselThumbs::-webkit-scrollbar {
            display: none;
        }
        
        .thumbnail {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
        }
        
        .thumbnail:hover {
            border-color: #1e88e5;
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(30, 136, 229, 0.2);
        }
        
        .thumbnail.active {
            border-color: #1e88e5;
            background: #e3f2fd;
            box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
        }
        
        .thumbnail img {
            width: 100%;
            height: 70px;
            object-fit: contain;
            border-radius: 4px;
            display: block;
        }
        
        /* Contenedor principal del carrusel */
        .carousel-wrapper {
            overflow: hidden;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            flex: 1;
            position: relative;
            background: #ffffff;
            padding-bottom: 0;
            border: 1px solid rgba(0,0,0,0.04);
        }
        
        #depieCarousel {
            display: flex;
            transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            height: 100%;
        }
        
        #depieCarousel > div, .carousel-slide {
            min-width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at center, #ffffff 0%, #f8f9fa 100%);
            height: 500px;
            padding: 40px;
        }
        
        #depieCarousel img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.12));
            transition: transform 0.4s ease;
        }
        
        #depieCarousel img:hover {
            transform: scale(1.03) translateY(-5px);
        }
        
        /* Botones de navegación */
        #carouselPrev, #carouselNext {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: 2px solid #f1f3f4;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10;
            font-size: 24px;
            color: #546e7a;
        }
        
        #carouselPrev:hover, #carouselNext:hover {
            background: #1e88e5;
            border-color: #1e88e5;
            color: white;
            transform: translateY(-50%) scale(1.15);
            box-shadow: 0 10px 25px rgba(30, 136, 229, 0.3);
        }
        
        #carouselPrev { left: 20px; }
        #carouselNext { right: 20px; }
        
        /* Indicadores */
        #carouselIndicators {
            display: flex;
            justify-content: center;
            gap: 8px;
            position: absolute;
            bottom: 25px;
            left: 0;
            right: 0;
            z-index: 10;
        }
        
        .progress-bar {
            width: 32px;
            height: 6px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: none;
        }
        
        .progress-bar:hover {
            background: rgba(30, 136, 229, 0.2);
            width: 40px;
        }
        
        .progress-bar.active {
            background: rgba(30, 136, 229, 0.15);
            width: 48px;
        }
        
        .progress-bar.active .progress-fill {
            height: 100%;
            background: #1e88e5;
            border-radius: 10px;
            animation: progressFill 5s linear forwards;
        }
        
        @keyframes progressFill {
            from { width: 0%; }
            to { width: 100%; }
        }
        
        .thumb-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 6px;
            pointer-events: none;
        }
        
        /* Sección de galería con fondo gris */
        .gallery-section {
            background-color: #f8f9fa;
            padding: 60px 0;
            margin: 40px 0;
            width: 100%;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 20px;
        }

        /* Estilos para el encabezado de la galería */
        .gallery-title {
            text-align: center;
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 700;
            position: relative;
            padding-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            
            /* Animación inicial */
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .gallery-title.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .gallery-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: #1e88e5;
            border-radius: 2px;
        }
        
        .gallery-description {
            text-align: center;
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 40px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        /* Estilos para la sección Hero (Imagen a la derecha, pequeña y animada) */
        .promo-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .hero-copy {
            flex: 1;
            text-align: left !important;
        }
        
        .hero-media {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .hero-media img {
            max-width: 280px !important; /* Imagen más pequeña */
            width: 100%;
            height: auto;
            border-radius: 20px;
            position: relative;
            z-index: 5;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
            animation: heroEntrance 1.2s ease-out forwards, floatHero 4s ease-in-out infinite 1.2s !important;
        }

        @keyframes heroEntrance {
            from { opacity: 0; transform: translateX(50px) scale(0.9); }
            to { opacity: 1; transform: translateX(0) scale(1); }
        }
        
        @keyframes floatHero {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 768px) {
            .carousel-container {
                flex-direction: column-reverse;
                height: auto;
            }
            
            #carouselThumbs {
                width: 100%;
                flex-direction: row;
                overflow-x: auto;
                height: auto;
                padding: 15px;
                gap: 10px;
            }
            
            .thumbnail {
                min-width: 120px;
                width: 120px;
                padding: 6px;
            }
            
            .thumbnail img {
                height: 80px;
            }
            
            .carousel-wrapper {
                height: 400px;
            }
            
            .promo-container {
                flex-direction: column-reverse !important;
                text-align: center !important;
            }
            .hero-copy { text-align: center !important; }
        }

        /* Efecto Typewriter para el título */
        .hero-copy h1 {
            display: inline-block;
            overflow: hidden;
            border-right: 3px solid #1e88e5;
            white-space: nowrap;
            animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
            max-width: fit-content;
        }

        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }

        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #1e88e5; }
        }

        /* Efecto de pulso para el botón de video */
        #openVideoBtn {
            position: relative;
            z-index: 1;
            animation: pulse 2s infinite;
            border-radius: 50px; /* Asegurar que el pulso sea circular */
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(30, 136, 229, 0.7);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(30, 136, 229, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(30, 136, 229, 0);
            }
        }

        /* Animación del Logo Roser */
        .logo-roser-anim {
            animation: logoPulse 3s infinite ease-in-out;
        }
        @keyframes logoPulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(30, 136, 229, 0.3)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(30, 136, 229, 0.6)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(30, 136, 229, 0.3)); }
        }

        /* Estilos Sección Sobre DePie (Nuevos) */
        .promo-about {
            background: linear-gradient(180deg, #f4faff 0%, #ffffff 100%);
            padding: 80px 0;
            position: relative;
        }
        
        .promo-about h2 {
            color: #1565c0;
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        
        .promo-about > .container > p {
            text-align: center;
            max-width: 750px;
            margin: 0 auto 4rem auto;
            color: #546e7a;
            font-size: 1.15rem;
            line-height: 1.7;
        }

        .features {
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .feature {
            background: white;
            padding: 40px 30px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(30, 136, 229, 0.08);
            flex: 1;
            min-width: 280px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(227, 242, 253, 0.8);
            position: relative;
            overflow: hidden;
            opacity: 0; 
            animation: fadeInUpFeature 0.8s ease-out forwards;
        }
        
        /* Barra superior azul en las tarjetas */
        .feature::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, #42a5f5, #1e88e5);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
        }
        
        .feature:hover::before {
            transform: scaleX(1);
        }

        .feature:nth-child(1) { animation-delay: 0.2s; }
        .feature:nth-child(2) { animation-delay: 0.4s; }
        .feature:nth-child(3) { animation-delay: 0.6s; }

        .feature:hover {
            transform: translateY(-12px);
            box-shadow: 0 20px 50px rgba(30, 136, 229, 0.15);
            border-color: rgba(30, 136, 229, 0.2);
        }

        .feature strong {
            display: block;
            font-size: 1.4rem;
            color: #0d47a1;
            margin-bottom: 15px;
            font-weight: 700;
        }
        
        .feature p {
            color: #607d8b;
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
        }

        @keyframes fadeInUpFeature {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
