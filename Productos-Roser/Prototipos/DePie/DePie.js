// DePie page scripts: sidebar menu + cart sync (copied behavior from site canonical files)
document.addEventListener('DOMContentLoaded', function() {
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
        'Nequi': '../../../Marketplace/metodos de pago/Nequi.png',
        'Daviplata': '../../../Marketplace/metodos de pago/Daviplata.png',
        'Bancolombia': '../../../Marketplace/metodos de pago/Bancolombia.png',
        'Efecty': '../../../Marketplace/metodos de pago/Efecty.png',
        'Visa': '../../../Marketplace/metodos de pago/Visa.png',
        'Mastercard': '../../../Marketplace/metodos de pago/Mastercard.png',
        'PSE': '../../../Marketplace/metodos de pago/PSE.png'
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
      if(window.showToast) {
          window.showToast('Método Eliminado', 'Se ha quitado el método de pago.');
      }
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
    // Mostrar contenedor de miniaturas
    if (thumbsContainer) {
        thumbsContainer.style.display = 'flex';
        thumbsContainer.innerHTML = '';
        
        const maxVisible = 4;
        const remaining = slides.length - maxVisible;
        
        // Generar miniaturas (máximo 4 visibles + 1 con contador)
        slides.forEach((slide, i) => {
            if (i < maxVisible) {
                const img = slide.querySelector('img');
                if (img) {
                    const thumb = document.createElement('div');
                    thumb.className = `thumbnail ${i === currentIndex ? 'active' : ''}`;
                    thumb.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Thumbnail ' + (i+1)}">`;
                    thumb.addEventListener('click', () => goToSlide(i));
                    thumbsContainer.appendChild(thumb);
                }
            }
        });
        
        // Agregar miniatura con contador si hay más imágenes
        if (remaining > 0) {
            const lastSlide = slides[maxVisible];
            const lastImg = lastSlide ? lastSlide.querySelector('img') : null;
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${currentIndex >= maxVisible ? 'active' : ''}`;
            if (lastImg) {
                thumb.innerHTML = `
                    <img src="${lastImg.src}" alt="Ver más">
                    <div class="thumb-overlay">+${remaining}</div>
                `;
            } else {
                thumb.innerHTML = `<div class="thumb-overlay">+${remaining}</div>`;
            }
            thumb.addEventListener('click', () => {
                openGalleryModal();
            });
            thumbsContainer.appendChild(thumb);
        }
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

  // --- Payment Modal Logic (Moved from HTML) ---
  window.openPaymentModal = function() {
      const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
      const modal = document.getElementById('paymentModal');
      if (modal) {
          if (window.$) $(modal).fadeIn(300); else modal.style.display = 'block';
          
          const options = modal.querySelectorAll('.payment-option');
          options.forEach(opt => {
              opt.classList.remove('selected');
              if(opt.innerText.trim() === selectedPaymentMethod) {
                  opt.classList.add('selected');
              }
          });
      }
  };

  window.closePaymentModal = function() {
      const modal = document.getElementById('paymentModal');
      if (modal) {
          if (window.$) $(modal).fadeOut(300); else modal.style.display = 'none';
      }
  };

  window.selectPayment = function(method, element) {
      const options = document.querySelectorAll('.payment-option');
      options.forEach(opt => opt.classList.remove('selected'));
      if(element) element.classList.add('selected');
      // Store temporarily or just use the selection for confirmation
      window._tempPaymentSelection = method;
  };

  window.confirmPaymentSelection = function() {
      const method = window._tempPaymentSelection || localStorage.getItem('selectedPayment');
      if(method) {
          localStorage.setItem('selectedPayment', method);
          closePaymentModal();
          updateCartDisplay();
          if(window.showToast) {
              window.playSuccessSound();
              window.showToast('¡Método Confirmado!', 'Pago actualizado a: ' + method);
          } else {
              alert('Método de pago actualizado: ' + method);
          }
      } else {
          alert('Por favor selecciona un método de pago');
      }
  };

  // --- Search Bar Functionality (Updated Links) ---
  const searchBox = document.querySelector('.search-box');
  const searchIcon = document.querySelector('#shared-search-btn');
  const searchInput = document.querySelector('#shared-search-input');
  const cancelIcon = document.querySelector('.cancel-icon');
  const searchResults = document.getElementById('search-results');

  // Product database with corrected relative paths (Up 3 levels to root)
 const products = getProductRoutes('../../../');

  if (searchIcon && searchInput && searchBox) {
      searchIcon.addEventListener('click', () => {
          searchBox.classList.add('active');
          searchIcon.classList.add('active');
          searchInput.classList.add('active');
          if(cancelIcon) cancelIcon.classList.add('active');
          searchInput.focus();
      });

      if(cancelIcon) {
          cancelIcon.addEventListener('click', () => {
              searchBox.classList.remove('active');
              searchIcon.classList.remove('active');
              searchInput.classList.remove('active');
              cancelIcon.classList.remove('active');
              searchInput.value = '';
              if(searchResults) searchResults.innerHTML = '';
          });
      }

      searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          if(searchResults) {
              if (query.length > 0) {
                  const results = Object.keys(products).filter(product => product.includes(query));
                  if (results.length > 0) {
                      searchResults.innerHTML = results.map(result => `
                          <div class="search-result-item" onclick="window.location.href='${products[result]}'">
                              <svg class="search-result-icon" viewBox="0 0 24 24" width="16" height="16" fill="#664AFF"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <span style="text-transform: capitalize;">${result}</span>
                          </div>
                      `).join('');
                      searchResults.style.display = 'block';
                  } else {
                      searchResults.style.display = 'none';
                  }
              } else {
                  searchResults.style.display = 'none';
              }
          }
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
          if (!searchBox.contains(e.target)) {
              searchBox.classList.remove('active');
              searchIcon.classList.remove('active');
              searchInput.classList.remove('active');
              if(cancelIcon) cancelIcon.classList.remove('active');
              if(searchResults) searchResults.style.display = 'none';
          }
      });
  }
});


// Animaciones del Hero
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.promo-hero .hero-copy h1');
    
    if (heroTitle) {
        // Remover el borde después de completar la animación de typewriter
        setTimeout(() => {
            heroTitle.classList.add('typing-complete');
        }, 3800);
    }
});


// Animaciones de la sección Sobre DePie
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const features = entry.target.querySelectorAll('.feature');
            features.forEach(feature => {
                feature.classList.add('animate');
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.promo-about');
if (aboutSection) {
    observer.observe(aboutSection);
}


// Función para expandir todas las miniaturas
function expandThumbs() {
    const thumbsContainer = document.getElementById('carouselThumbs');
    if (!thumbsContainer) return;
    
    const carousel = document.getElementById('depieCarousel');
    const slides = carousel ? Array.from(carousel.children) : [];
    
    thumbsContainer.innerHTML = '';
    
    slides.forEach((slide, i) => {
        const img = slide.querySelector('img');
        if (img) {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${i === window.currentCarouselIndex ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Thumbnail ' + (i+1)}">`;
            thumb.addEventListener('click', () => {
                if (window.goToSlide) window.goToSlide(i);
            });
            thumbsContainer.appendChild(thumb);
        }
    });
}


// Modal de galería con barra lateral
function openGalleryModal() {
    const carousel = document.getElementById('depieCarousel');
    const slides = carousel ? Array.from(carousel.children) : [];
    
    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'galleryModal';
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="gallery-modal-content">
            <button class="gallery-modal-close">&times;</button>
            <div class="gallery-modal-sidebar">
                ${slides.map((slide, i) => {
                    const img = slide.querySelector('img');
                    return img ? `<div class="gallery-modal-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                        <img src="${img.src}" alt="${img.alt || 'Imagen ' + (i+1)}">
                    </div>` : '';
                }).join('')}
            </div>
            <div class="gallery-modal-main">
                <img id="galleryModalImg" src="${slides[0]?.querySelector('img')?.src || ''}" alt="">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    modal.querySelector('.gallery-modal-close').addEventListener('click', closeGalleryModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGalleryModal();
    });
    
    modal.querySelectorAll('.gallery-modal-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            const img = slides[index]?.querySelector('img');
            if (img) {
                document.getElementById('galleryModalImg').src = img.src;
                modal.querySelectorAll('.gallery-modal-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        });
    });
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}
