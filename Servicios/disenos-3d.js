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
    'organizador magnético de cables hexastack h1-80': '../Marketplace/productos/producto-organizador-magnetico.html',
    'organizador magnético': '../Marketplace/productos/producto-organizador-magnetico.html',
    'hexastack': '../Marketplace/productos/producto-organizador-magnetico.html',
    'caja táctica para munición 9mm': '../Marketplace/productos/producto-caja-tactica.html',
    'caja táctica': '../Marketplace/productos/producto-caja-tactica.html',
    'munición': '../Marketplace/productos/producto-caja-tactica.html',
    'tacbox': '../Marketplace/productos/producto-caja-tactica.html',
    'caja para cables cctv cámaras de seguridad': '../Marketplace/productos/producto-caja-cables-cctv.html',
    'cables cctv': '../Marketplace/productos/producto-caja-cables-cctv.html',
    'cctv 4 canales': '../Marketplace/productos/producto-caja-cables-cctv.html',
    'baluns y borneras caja para cables cctv 8 canales': '../Marketplace/productos/producto-baluns-8-canales.html',
    'baluns cctv 8 canales': '../Marketplace/productos/producto-baluns-8-canales.html',
    'borneras': '../Marketplace/productos/producto-baluns-8-canales.html',
    'soporte qr para negocios': '../Marketplace/productos/producto-soporte-qr.html',
    'soporte qr': '../Marketplace/productos/producto-soporte-qr.html',
    'código qr': '../Marketplace/productos/producto-soporte-qr.html',
    '3dcost': '../Productos-Roser/3dcost/3dcost.html',
    'marketplace': '../Marketplace/marketplace.html',
    'impresión 3d': 'impresiones-3d.html',
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
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
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
  updateCartDisplay();
  
  alert('Producto agregado al carrito');
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
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP\n\n`;
  });
  
  message += `Total: $${total.toLocaleString('es-CO')} COP`;
  
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