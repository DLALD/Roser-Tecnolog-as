// Sidebar dropdown functionality
const menuButton = document.querySelector('.menu-button');
const sidebarDropdown = document.querySelector('.sidebar-dropdown');
const sectionHeaders = document.querySelectorAll('.section-header');

// Menu button toggle
menuButton.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebarDropdown.classList.toggle('active');
});

// Section headers toggle
sectionHeaders.forEach(sectionHeader => {
  sectionHeader.setAttribute('tabindex', '0');
  
  const toggleSection = (e) => {
    e.stopPropagation();
    const subsection = sectionHeader.nextElementSibling;
    const sectionArrow = sectionHeader.querySelector('.section-arrow');
    
    subsection.classList.toggle('active');
    if (sectionArrow) {
      sectionArrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  };
  
  sectionHeader.addEventListener('click', toggleSection);
});

// Apps header toggle
document.querySelectorAll('.apps-header').forEach(appsHeader => {
  appsHeader.setAttribute('tabindex', '0');
  
  const toggleAppsSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const subSubsection = appsHeader.nextElementSibling;
    const sectionArrow = appsHeader.querySelector('.section-arrow');
    
    if (subSubsection && subSubsection.classList.contains('sub-subsection')) {
      subSubsection.classList.toggle('active');
      if (sectionArrow) {
        sectionArrow.style.transform = subSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  };
  
  appsHeader.addEventListener('click', toggleAppsSubmenu);
});

// Prototypes header toggle
document.querySelectorAll('.prototypes-header').forEach(prototypesHeader => {
  prototypesHeader.setAttribute('tabindex', '0');
  
  const togglePrototypesSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prototypeSubsection = prototypesHeader.nextElementSibling;
    const sectionArrow = prototypesHeader.querySelector('.section-arrow');
    
    if (prototypeSubsection && prototypeSubsection.classList.contains('prototype-subsection')) {
      prototypeSubsection.classList.toggle('active');
      if (sectionArrow) {
        sectionArrow.style.transform = prototypeSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  };
  
  prototypesHeader.addEventListener('click', togglePrototypesSubmenu);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!menuButton.contains(e.target) && !sidebarDropdown.contains(e.target)) {
    sidebarDropdown.classList.remove('active');
  }
});

// Close sidebar dropdown when clicking on a link
document.querySelectorAll('.sidebar-dropdown a:not(.apps-header)').forEach(n => n.addEventListener('click', () => {
  sidebarDropdown.classList.remove('active');
}));

// Search functionality
const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-box input');
const cancelIcon = document.querySelector('.cancel-icon');

if (searchBox && searchIcon && searchInput && cancelIcon) {
  searchIcon.addEventListener('click', () => {
    searchBox.classList.add('active');
    searchIcon.classList.add('active');
    searchInput.classList.add('active');
    cancelIcon.classList.add('active');
    searchInput.focus();
  });
  
  cancelIcon.addEventListener('click', () => {
    searchBox.classList.remove('active');
    searchIcon.classList.remove('active');
    searchInput.classList.remove('active');
    cancelIcon.classList.remove('active');
    searchInput.value = '';
    showSearchResults([], {});
  });
  
  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
      searchBox.classList.remove('active');
      searchIcon.classList.remove('active');
      searchInput.classList.remove('active');
      cancelIcon.classList.remove('active');
      searchInput.value = '';
      showSearchResults([], {});
    }
  });
  
// Funcionalidad de búsqueda con redirección - Updated v2
     const products = getProductRoutes('../../');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
      const results = Object.keys(products).filter(product => 
        product.includes(query)
      );
      showSearchResults(results, products);
    } else {
      showSearchResults([], products);
    }
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.toLowerCase();
      const exactMatch = Object.keys(products).find(product => 
        product.includes(query)
      );
      if (exactMatch) {
        window.location.href = products[exactMatch];
      }
    }
  });
}

function showSearchResults(results, products) {
  let dropdown = document.querySelector('.search-dropdown');
  
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '50px';
    dropdown.style.left = '0';
    dropdown.style.width = '100%';
    dropdown.style.background = 'white';
    dropdown.style.border = '1px solid #e0e0e0';
    dropdown.style.borderRadius = '8px';
    dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.zIndex = '9999';
    dropdown.style.padding = '8px 0';
    searchBox.appendChild(dropdown);
  }
  
  if (results.length > 0) {
    dropdown.innerHTML = results.map(result => `
      <div style="padding: 12px 16px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 12px;" 
           onmouseover="this.style.background='#f8f9fa'" 
           onmouseout="this.style.background='white'"
           onclick="selectSearchResult('${result}', '${products[result]}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#664AFF">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span style="color: #333; font-size: 14px; text-transform: capitalize; flex: 1;">${result}</span>
      </div>
    `).join('');
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
}

function selectSearchResult(result, url) {
  showSearchResults([], {});
  searchBox.classList.remove('active');
  searchIcon.classList.remove('active');
  searchInput.classList.remove('active');
  cancelIcon.classList.remove('active');
  searchInput.value = '';
  window.location.href = url;
}

// Cart system - Same as marketplace
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Payment Method Logos
const paymentMethodLogos = {
    'Nequi': '../../Marketplace/metodos de pago/Nequi.png',
    'Daviplata': '../../Marketplace/metodos de pago/Daviplata.png',
    'Bancolombia': '../../Marketplace/metodos de pago/Bancolombia.png',
    'Efecty': '../../Marketplace/metodos de pago/Efecty.png',
    'Visa': '../../Marketplace/metodos de pago/Visa.png',
    'Mastercard': '../../Marketplace/metodos de pago/Mastercard.png',
    'PSE': '../../Marketplace/metodos de pago/PSE.png'
};

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = count;
  if (count > 0) {
    cartCountElement.style.display = 'flex';
  } else {
    cartCountElement.style.display = 'none';
  }
}

function updateCartUI() {
  const cartBody = document.getElementById('cartBody');
  const cartPaymentMethod = document.getElementById('cartPaymentMethod');
  
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    document.getElementById('cart-total').textContent = '$0 COP';
    return;
  }
  
  let html = '<div class="cart-items">';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    // Ajustar ruta de la imagen para la ubicación actual
    let imagePath = item.image;
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
        if (imagePath.includes('Marketplace/')) {
            imagePath = '../../Marketplace/' + imagePath.split('Marketplace/')[1];
        } else if (imagePath.includes('Imagenes/')) {
            imagePath = '../../Imagenes/' + imagePath.split('Imagenes/')[1];
        }
    }

    html += `
      <div class="cart-item">
        <img src="${imagePath}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${item.price.toLocaleString('es-CO')} COP</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="decreaseQuantity(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
        </div>
        <div class="cart-item-total">$${itemTotal.toLocaleString('es-CO')} COP</div>
        <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
      </div>
    `;
  });
  
  html += '</div>';
  cartBody.innerHTML = html;
  document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CO')} COP`;

  // Actualizar visualización del método de pago
  const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
  if (cartPaymentMethod) {
      if(selectedPaymentMethod) {
          const logoSrc = paymentMethodLogos[selectedPaymentMethod];
          let paymentHtml = '<div style="display: flex; align-items: center; gap: 8px;">';
          if (logoSrc) {
              paymentHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
          }
          paymentHtml += `<span style="font-weight: bold; color: #333;">${selectedPaymentMethod}</span>`;
          paymentHtml += `<button class="remove-payment-btn" onclick="removePaymentMethod()" title="Quitar método de pago">&times;</button>`;
          paymentHtml += '</div>';
          cartPaymentMethod.innerHTML = paymentHtml;
      } else {
          cartPaymentMethod.innerHTML = '<span style="color: #f57c00; cursor: pointer;" onclick="closeCartModal(); openPaymentModal();">No seleccionado (Clic para elegir)</span>';
      }
  }
}

window.addToCart = function(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (typeof updateCartDisplay === 'function') updateCartDisplay(); else updateCartUI();
  
  showNotification('¡Excelente!', 'Servicio agregado al carrito', 'success');
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (typeof updateCartDisplay === 'function') updateCartDisplay(); else updateCartUI();
};

window.increaseQuantity = function(index) {
  cart[index].quantity++;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (typeof updateCartDisplay === 'function') updateCartDisplay(); else updateCartUI();
};

window.decreaseQuantity = function(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (typeof updateCartDisplay === 'function') updateCartDisplay(); else updateCartUI();
  }
};

window.openCartModal = function() {
  if (typeof updateCartDisplay === 'function') updateCartDisplay(); else updateCartUI();
  document.getElementById('cartModal').style.display = 'block';
};

window.closeCartModal = function() {
  document.getElementById('cartModal').style.display = 'none';
};

window.checkout = function() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  // Obtener el método de pago seleccionado
  const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';

  const phone = '573113579437';
  let message = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP\n\n`;
  });
  
  message += `Total: $${total.toLocaleString('es-CO')} COP`;

  if (selectedPaymentMethod) {
      message += `\n\nMétodo de Pago: ${selectedPaymentMethod}`;
  } else {
      message += `\n\nMétodo de Pago: A convenir`;
  }
  
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

// Initialize cart
updateCartCount();
updateCartUI();

// Payment Logic
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
    window._tempPaymentSelection = method;
};

window.confirmPaymentSelection = function() {
    const method = window._tempPaymentSelection || localStorage.getItem('selectedPayment');
    if(method) {
        localStorage.setItem('selectedPayment', method);
        closePaymentModal();
        updateCartUI();
        showNotification('¡Método Confirmado!', 'Pago actualizado a: ' + method, 'success');
    } else {
        showNotification('Atención', 'Por favor selecciona un método de pago', 'info');
    }
};

window.removePaymentMethod = function() {
    localStorage.removeItem('selectedPayment');
    updateCartUI();
    showNotification('Método Eliminado', 'Se ha quitado el método de pago.', 'error');
};

// Notification System
window.playNotificationSound = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
};

window.showNotification = function(title, message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    let icon = type === 'error' ? '✕' : (type === 'info' ? 'ℹ' : '✓');
    const html = `
        <div class="toast-notification ${type}">
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    const toast = document.querySelector('.toast-notification');
    
    if (type === 'success') playNotificationSound();
    
    // Force reflow
    void toast.offsetWidth;
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// Inicializar WhatsApp
$(function () {
    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿En qué podemos ayudarte con diseño eléctrico?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const cartModal = document.getElementById('cartModal');
  const paymentModal = document.getElementById('paymentModal');
  
  if (event.target === cartModal) {
    closeCartModal();
  }
  
  if (event.target === paymentModal) {
    closePaymentModal();
  }
});

// Solución para botones no clickeables y funcionalidad de cotización
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listener al botón X del modal de pago
    const paymentModalClose = document.querySelector('#paymentModal .close');
    if (paymentModalClose) {
        paymentModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closePaymentModal();
        });
    }

    // 1. Corrección de estilos (Z-Index)
    const style = document.createElement('style');
    style.textContent = `
        .hero-text, .hero-content {
            position: relative;
            z-index: 10;
        }
        .hero-text a, .hero-text button, .whatsapp-button, .btn-primary, .btn {
            position: relative;
            z-index: 20 !important;
            cursor: pointer;
        }
        .hero-image, .model-viewer-container {
            z-index: 1;
        }
        
        /* Corrección del Modal del Carrito (Estilo Index - Optimizado) */
        #cartModal .modal-content {
            max-width: 600px !important;
            width: 90% !important;
            margin: 5% auto !important;
            max-height: 85vh !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 0 !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        }

        #cartModal .cart-header {
            padding: 20px 25px !important;
            border-bottom: 1px solid #f0f0f0 !important;
            flex-shrink: 0;
            background: #fff;
            position: relative;
        }

        #cartModal .cart-header h2 {
            font-size: 1.5rem !important;
            margin: 0 !important;
            color: #333;
        }

        #cartModal .cart-body {
            padding: 20px 25px !important;
            overflow-y: auto !important;
            flex-grow: 1;
            overscroll-behavior: contain;
        }

        #cartModal .cart-footer {
            padding: 20px 25px !important;
            border-top: 1px solid #f0f0f0 !important;
            flex-shrink: 0;
            background: #f9f9f9;
        }

        #cartModal .close {
            top: 20px !important;
            right: 25px !important;
            font-size: 28px !important;
            line-height: 1 !important;
            z-index: 10;
            color: #aaa;
            opacity: 1;
        }
        
        #cartModal .close:hover {
            color: #333;
        }
        
        /* Mejorar botón X del modal de pago */
        #paymentModal .close {
            position: absolute;
            top: 15px !important;
            right: 15px !important;
            width: 36px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #f5f5f5 !important;
            border-radius: 50% !important;
            font-size: 24px !important;
            line-height: 1 !important;
            color: #666 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            z-index: 100 !important;
            border: none !important;
            padding: 0 !important;
        }
        
        #paymentModal .close:hover {
            background: #e53935 !important;
            color: white !important;
            transform: rotate(90deg) !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Asignar funcionalidad al botón de Cotizar (Igual que en Diseño 3D)
    const heroBtns = document.querySelectorAll('.hero-text a, .hero-text button, .whatsapp-button, a[href="#cotizar"]');
    heroBtns.forEach(btn => {
        // Verificar si es un botón de cotizar
        if (btn.textContent.toLowerCase().includes('cotizar') || btn.classList.contains('whatsapp-button') || btn.getAttribute('href') === '#cotizar') {
            
            const phone = '573113579437';
            const message = 'Hola, me interesa solicitar una cotización para Diseño Eléctrico.';
            const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            
            // Si es un enlace <a>, actualizamos el href directamente para que funcione nativamente
            if (btn.tagName === 'A') {
                btn.href = url;
                btn.target = '_blank';
            }
            
            btn.addEventListener('click', function(e) {
                // Si es un botón (no enlace), abrimos la ventana manualmente
                if (this.tagName !== 'A') {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(url, '_blank');
                }
            });
        }
    });
});