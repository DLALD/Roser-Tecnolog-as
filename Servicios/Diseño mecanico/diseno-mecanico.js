// Services Data
const services = [
    {
        id: 1,
        name: "Diseño de Piezas Mecánicas",
        description: "Diseño CAD de piezas mecánicas personalizadas con especificaciones técnicas detalladas",
        details: [
            "Modelado 3D preciso",
            "Especificaciones técnicas",
            "Tolerancias dimensionales",
            "Selección de materiales"
        ],
        icon: "Diseños mecanicos/3.png"
    },
    {
        id: 2,
        name: "Diseño de Ensambles",
        description: "Diseño completo de ensambles mecánicos con análisis de interferencias",
        details: [
            "Ensambles complejos",
            "Análisis de interferencias",
            "Lista de materiales (BOM)",
            "Explosionados técnicos"
        ],
        icon: "Diseños mecanicos/4.png"
    },
    {
        id: 3,
        name: "Planos Técnicos",
        description: "Elaboración de planos técnicos normalizados para fabricación",
        details: [
            "Planos normalizados",
            "Vistas y cortes técnicos",
            "Acotación detallada",
            "Notas de fabricación"
        ],
        icon: "Diseños mecanicos/5.png"
    },
    {
        id: 4,
        name: "Diseño de Mecanismos",
        description: "Diseño de mecanismos y sistemas de transmisión de movimiento",
        details: [
            "Sistemas de transmisión",
            "Análisis cinemático",
            "Cálculo de fuerzas",
            "Optimización de movimiento"
        ],
        icon: "Diseños mecanicos/6.png"
    }
];

// Cart from localStorage
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

// Load Services
function loadServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = services.map(service => `
        <div class="service-card" data-id="${service.id}">
            <div class="service-icon">
                <img src="${service.icon}" alt="${service.name}">
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <ul class="service-details">
                ${service.details.map(detail => `<li>✓ ${detail}</li>`).join('')}
            </ul>
            <button class="btn-add-cart" onclick="cotizarServicio(${service.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                Cotizar Servicio
            </button>
        </div>
    `).join('');
}

// Cotizar Servicio directo por WhatsApp
function cotizarServicio(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    const message = `¡Hola! Me gustaría solicitar cotización para:\n\n${service.name}\n${service.description}\n\n¿Podrían proporcionarme más información?`;
    const whatsappUrl = `https://wa.me/573113579437?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add to Cart
function addToCart(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    const existingItem = cart.find(item => item.name === service.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: service.name,
            price: 0,
            quantity: 1,
            image: 'Servicios/Diseño mecanico/' + service.icon
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification('¡Excelente!', 'Servicio agregado al carrito', 'success');
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Increase Quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Decrease Quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartPaymentMethod = document.getElementById('cartPaymentMethod');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (totalItems === 0) {
        cartItems.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
        cartTotal.textContent = '$0 COP';
    } else {
        cartItems.innerHTML = cart.map((item, index) => {
            let imageSrc = item.image;
            // Corrección de rutas de imágenes para que funcionen desde la subcarpeta
            if (!imageSrc.startsWith('http') && !imageSrc.startsWith('file:') && !imageSrc.startsWith('data:')) {
                imageSrc = imageSrc.replace(/^(\.\.\/|\.\/)+/, '');
                imageSrc = '../../' + imageSrc;
            }
            return `
            <div class="cart-item">
                <img src="${imageSrc}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price > 0 ? '$' + item.price.toLocaleString('es-CO') + ' COP' : 'Cotización'}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
                <div class="cart-item-total">${item.price > 0 ? '$' + (item.price * item.quantity).toLocaleString('es-CO') + ' COP' : 'Cotización'}</div>
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `}).join('');
        
        if (totalPrice > 0) {
            cartTotal.textContent = '$' + totalPrice.toLocaleString('es-CO') + ' COP';
        } else {
            cartTotal.textContent = 'Cotización';
        }
    }

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

// Search Functionality - Copied from diseño eléctrico
const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.getElementById('searchInput');
const cancelIcon = document.querySelector('.cancel-icon');

   const products = getProductRoutes('../../');

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

// Cart Modal
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');

cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Checkout Function
window.checkout = function() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Obtener el método de pago seleccionado
    const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    
    let message = '¡Hola! Me gustaría solicitar cotización para:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = (item.price || 0) * item.quantity;
        total += itemTotal;
        message += `• ${item.name}\n  Cantidad: ${item.quantity}`;
        if (item.price > 0) {
            message += `\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP`;
        }
        message += '\n\n';
    });
    
    if (total > 0) {
        message += `Total: $${total.toLocaleString('es-CO')} COP`;
    }
    
    if (selectedPaymentMethod) {
        message += `\n\nMétodo de Pago: ${selectedPaymentMethod}`;
    } else {
        message += `\n\nMétodo de Pago: A convenir`;
    }
    
    message += '\n\n¿Podrían proporcionarme más información?';
    
    const whatsappUrl = `https://wa.me/573113579437?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Menu Button Toggle
const menuButton = document.querySelector('.menu-button');
const sidebarDropdown = document.querySelector('.sidebar-dropdown');

menuButton.addEventListener('click', () => {
    sidebarDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !sidebarDropdown.contains(e.target)) {
        sidebarDropdown.classList.remove('active');
    }
});

// Dropdown Sections
document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
        const subsection = header.nextElementSibling;
        subsection.classList.toggle('active');
        const arrow = header.querySelector('.section-arrow');
        arrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
});

// Prototypes and Apps Headers
document.querySelectorAll('.prototypes-header, .apps-header').forEach(header => {
    header.addEventListener('click', () => {
        const subsection = header.nextElementSibling;
        subsection.classList.toggle('active');
    });
});

// WhatsApp Floating Button
$(document).ready(function() {
    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿En qué podemos ayudarte con diseño mecánico?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});

// Initialize
loadServices();
updateCartUI();

// Zoom on Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('zoomed');
        }
    });
}, observerOptions);

// Observe all zoom elements after a small delay to ensure DOM is ready
setTimeout(() => {
    document.querySelectorAll('.zoom-on-scroll').forEach(element => {
        observer.observe(element);
        // Add click event to restart animation
        element.addEventListener('click', () => {
            element.classList.remove('zoomed');
            setTimeout(() => {
                element.classList.add('zoomed');
            }, 10);
        });
    });
    
    // Add click event to hero image
    const heroImage = document.querySelector('.slide-in-right');
    if (heroImage) {
        heroImage.addEventListener('click', () => {
            heroImage.style.animation = 'none';
            setTimeout(() => {
                heroImage.style.animation = 'slideInRight 1s ease-out forwards';
            }, 10);
        });
    }
}, 100);
