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
  const products = {
    'organizador magnético de cables hexastack h1-80': '../../Marketplace/productos/producto-organizador-magnetico.html',
    'organizador magnético': '../../Marketplace/productos/producto-organizador-magnetico.html',
    'hexastack': '../../Marketplace/productos/producto-organizador-magnetico.html',
    'caja táctica para munición 9mm': '../../Marketplace/productos/producto-caja-tactica.html',
    'caja táctica': '../../Marketplace/productos/producto-caja-tactica.html',
    'munición': '../../Marketplace/productos/producto-caja-tactica.html',
    'tacbox': '../../Marketplace/productos/producto-caja-tactica.html',
    'caja para cables cctv cámaras de seguridad': '../../Marketplace/productos/producto-caja-cables-cctv.html',
    'cables cctv': '../../Marketplace/productos/producto-caja-cables-cctv.html',
    'cctv 4 canales': '../../Marketplace/productos/producto-caja-cables-cctv.html',
    'baluns y borneras caja para cables cctv 8 canales': '../../Marketplace/productos/producto-baluns-8-canales.html',
    'baluns cctv 8 canales': '../../Marketplace/productos/producto-baluns-8-canales.html',
    'borneras': '../../Marketplace/productos/producto-baluns-8-canales.html',
    'soporte qr para negocios': '../../Marketplace/productos/producto-soporte-qr.html',
    'soporte qr': '../../Marketplace/productos/producto-soporte-qr.html',
    'código qr': '../../Marketplace/productos/producto-soporte-qr.html',
    '3dcost': '../../Productos-Roser/3dcost/3dcost.html',
    'marketplace': '../../Marketplace/marketplace.html',
    'impresión 3d': '../impresiones-3d.html',
    'diseño 3d': 'disenos-3.html'
  };
  
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

function updateCartDisplay() {
  const cartBody = document.getElementById('cartBody');
  
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    document.getElementById('cart-total').textContent = '$0 COP';
    return;
  }
  
  let html = '<div class="cart-items">';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = (item.price || 0) * item.quantity;
    total += itemTotal;
    
    // Corregir ruta de imagen para que funcione desde la subcarpeta
    let imagePath = item.image || '';
    if (!imagePath.startsWith('http') && !imagePath.startsWith('../../')) {
        if (imagePath.includes('Marketplace/')) {
            imagePath = '../../' + imagePath;
        } else {
            imagePath = '../../Marketplace/' + imagePath;
        }
    }

    html += `
      <div class="cart-item" style="display:flex; align-items:center; gap:10px; border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px; position: relative;">
        <img src="${imagePath}" alt="${item.name}" class="cart-item-img" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
        <div class="cart-item-details">
          <h4 style="margin:0; font-size:0.9rem;">${item.name}</h4>
          <p class="cart-item-price" style="margin:0; color:#666; font-size:0.8rem;">$${(item.price || 0).toLocaleString('es-CO')} COP</p>
        </div>
        <div class="cart-item-quantity" style="display:flex; align-items:center; gap:5px;">
          <button onclick="decreaseQuantity(${index})" style="width:25px;">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})" style="width:25px;">+</button>
        </div>
        <div class="cart-item-total" style="font-weight:bold;">$${itemTotal.toLocaleString('es-CO')}</div>
        <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
      </div>
    `;
  });
  
  html += '</div>';
  cartBody.innerHTML = html;
  document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CO')} COP`;

  // Actualizar visualización del método de pago
  const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
  const paymentContainer = document.getElementById('cartPaymentMethod');
  const paymentMethodLogos = {
      'Nequi': '../../Marketplace/metodos de pago/Nequi.png',
      'Daviplata': '../../Marketplace/metodos de pago/Daviplata.png',
      'Bancolombia': '../../Marketplace/metodos de pago/Bancolombia.png',
      'Efecty': '../../Marketplace/metodos de pago/Efecty.png',
      'Visa': '../../Marketplace/metodos de pago/Visa.png',
      'Mastercard': '../../Marketplace/metodos de pago/Mastercard.png',
      'PSE': '../../Marketplace/metodos de pago/PSE.png'
  };

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

// Funciones de Métodos de Pago
window.openPaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if(modal) {
        modal.style.display = 'block';
        // Restaurar selección previa
        const selected = localStorage.getItem('selectedPayment');
        if(selected) {
            document.querySelectorAll('.payment-option').forEach(opt => {
                if(opt.innerText.trim() === selected) opt.classList.add('selected');
                else opt.classList.remove('selected');
            });
        }
    }
};

window.closePaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if(modal) modal.style.display = 'none';
};

window.selectPayment = function(method, element) {
    localStorage.setItem('tempPayment', method);
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
};

window.confirmPaymentSelection = function() {
    const method = localStorage.getItem('tempPayment');
    if(method) {
        localStorage.setItem('selectedPayment', method);
        localStorage.removeItem('tempPayment');
        closePaymentModal();
        updateCartDisplay();
        showNotification('¡Método Confirmado!', 'Pago actualizado a: ' + method, 'success');
    } else {
        alert('Por favor selecciona un método de pago');
    }
};

window.removePaymentMethod = function() {
    localStorage.removeItem('selectedPayment');
    updateCartDisplay();
    showNotification('Método Eliminado', 'Se ha quitado el método de pago.', 'error');
};

// Sistema de Notificaciones con Sonido
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
    // Eliminar notificaciones previas
    const existing = document.querySelectorAll('.toast-notification');
    existing.forEach(e => e.remove());

    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';
    
    const html = `
        <div class="toast-notification ${type}" style="position: fixed; bottom: 30px; right: 30px; background: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 15px; transform: translateY(100px); opacity: 0; transition: all 0.4s; z-index: 10000; border-left: 5px solid ${type === 'error' ? '#f44336' : (type === 'info' ? '#2196F3' : '#4CAF50')};">
            <div class="toast-icon" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #e8f5e9; color: ${type === 'error' ? '#f44336' : (type === 'info' ? '#2196F3' : '#4CAF50')}; font-weight: bold; font-size: 1.2rem;">${icon}</div>
            <div class="toast-content">
                <div class="toast-title" style="font-weight: 700; font-size: 1rem; color: #333;">${title}</div>
                <div class="toast-message" style="font-size: 0.9rem; color: #666;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    const toast = document.querySelector('.toast-notification');
    
    if (type === 'success') playNotificationSound();
    
    // Trigger reflow
    void toast.offsetWidth;
    
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

window.addToCart = function(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartDisplay();
  
  showNotification('¡Excelente!', 'Producto agregado al carrito', 'success');
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartDisplay();
};

window.increaseQuantity = function(index) {
  cart[index].quantity++;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartDisplay();
};

window.decreaseQuantity = function(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
};

window.openCartModal = function() {
  updateCartDisplay();
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
  
  const phone = '573113579437';
  let message = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = (item.price || 0) * item.quantity;
    total += itemTotal;
    message += `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP\n\n`;
  });
  
  message += `Total: $${total.toLocaleString('es-CO')} COP`;
  
  const currentPaymentMethod = localStorage.getItem('selectedPayment') || '';
  message += currentPaymentMethod ? `\n\nMétodo de Pago: ${currentPaymentMethod}` : `\n\nMétodo de Pago: A convenir`;
  
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

// Initialize cart
updateCartCount();
updateCartDisplay();

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    closeCartModal();
  }
});

// Sincronizar cambios de almacenamiento
window.addEventListener('storage', function(e) {
    if (e.key === 'selectedPayment') updateCartDisplay();
});

// Variables globales para carousel
let currentSlide = 0;
let totalSlides = 5;

// Funciones globales para carousel
function changeDesignSlide(direction) {
  currentSlide += direction;
  
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  
  updateCarousel();
}

function goToDesignSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}

function updateCarousel() {
  const carousel = document.getElementById('designCarousel');
  const progressBars = document.querySelectorAll('.progress-bar');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (carousel) {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  
  // Update progress bars
  progressBars.forEach((bar, index) => {
    if (index === currentSlide) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  });
  
  // Update thumbnails
  thumbnails.forEach((thumbnail, index) => {
    if (index === currentSlide) {
      thumbnail.classList.add('active');
    } else {
      thumbnail.classList.remove('active');
    }
  });
}

// Modal functions
function openImageModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  
  modalImage.src = imageSrc;
  modal.style.display = 'block';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
}

// Funciones para modal 3D
function open3DModal(modelSrc) {
  const modal = document.getElementById('model3DModal');
  const modelViewer = document.getElementById('modal3DViewer');
  
  modelViewer.src = modelSrc;
  modal.style.display = 'block';
}

function close3DModal() {
  const modal = document.getElementById('model3DModal');
  modal.style.display = 'none';
}

// Add click functionality to progress bars
document.addEventListener('DOMContentLoaded', function() {
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach((bar, index) => {
    bar.addEventListener('click', () => {
      goToDesignSlide(index);
    });
  });
  
  // Close modal when clicking outside the image
  document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeImageModal();
    }
  });
  
  // Close modal when clicking outside 3D model
  document.getElementById('model3DModal').addEventListener('click', function(e) {
    if (e.target === this) {
      close3DModal();
    }
  });
  
  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeImageModal();
      close3DModal();
    }
  });
});

// Auto-play
setInterval(function() {
  changeDesignSlide(1);
}, 6000);