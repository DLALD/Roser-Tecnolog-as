// Variables del carrusel
let currentSlide = 0;
const totalSlides = 13;

// Función para cambiar slide
function changeSlide(direction) {
    const slides = document.getElementById('carouselSlides');
    const indicators = document.querySelectorAll('.indicator');
    
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Función para ir a un slide específico
function goToSlide(slideIndex) {
    const slides = document.getElementById('carouselSlides');
    const indicators = document.querySelectorAll('.indicator');
    
    currentSlide = slideIndex;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Inicializar indicadores del carrusel
function initCarouselIndicators() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Auto-play del carrusel (opcional)
function startAutoPlay() {
    setInterval(() => {
        changeSlide(1);
    }, 5000); // Cambia cada 5 segundos
}

// Animaciones y efectos para 3DCost

// Función para detectar cuando un elemento entra en el viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Función para detectar cuando un elemento está parcialmente visible
function isElementPartiallyVisible(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= windowHeight &&
        rect.left <= windowWidth
    );
}

// Animación de scroll reveal
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isElementPartiallyVisible(element)) {
            element.classList.add('animate-visible');
        }
    });
}

// Efecto parallax suave para elementos flotantes
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
}

// Efecto de hover mejorado para las tarjetas
function enhanceCardHovers() {
    const cards = document.querySelectorAll('.feature-card, .screenshot-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Efecto de seguimiento del mouse
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Animación de contador para números
function animateCounters() {
    const counters = document.querySelectorAll('.step-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar animación cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Efecto de escritura para títulos
function typewriterEffect() {
    const titles = document.querySelectorAll('.hero-section h1');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #2c5aa0';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Remover cursor después de completar
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Iniciar después de un pequeño delay
        setTimeout(typeWriter, 500);
    });
}

// Navegación suave mejorada
function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Efecto de partículas flotantes
function createFloatingParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heroSection.appendChild(particle);
    }
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Efecto de cursor personalizado
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Efectos en hover
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .screenshot-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'loading-animation';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    initCarouselIndicators();
    // startAutoPlay(); // Descomenta si quieres auto-play
    
    // Inicializar todas las funciones
    animateOnScroll();
    enhanceCardHovers();
    animateCounters();
    typewriterEffect();
    smoothScrolling();
    createFloatingParticles();
    initScrollToTop();
    initLazyLoading();
    
    // Inicializar carrito
    updateCartUI();
    
    // Sincronizar método de pago al cargar
    window.addEventListener('storage', function(e) {
        if (e.key === 'selectedPayment') {
            updateCartUI();
        }
    });
    
    // Evento para abrir modal desde el carrito (delegación)
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.cart-payment-info')) {
            openPaymentModal();
        }
    });
    
    // Inicializar preloader solo si no es una recarga
    if (!sessionStorage.getItem('visited')) {
        initPreloader();
        sessionStorage.setItem('visited', 'true');
    }
    
    // Event listeners para scroll
    window.addEventListener('scroll', () => {
        animateOnScroll();
        parallaxEffect();
    });
    
    // Optimización del scroll con throttling
    let ticking = false;
    function updateOnScroll() {
        animateOnScroll();
        parallaxEffect();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Agregar clases de animación con delay escalonado
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
    });
});

// Menú dropdown mejorado
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const dropdown = document.querySelector('.sidebar-dropdown');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const appsHeader = document.querySelector('.apps-header');
    const prototypesHeader = document.querySelector('.prototypes-header');
    
    // Toggle del menú principal
    if (menuButton && dropdown) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !menuButton.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Toggle de secciones
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const subsection = this.nextElementSibling;
            const arrow = this.querySelector('.section-arrow');
            
            subsection.classList.toggle('active');
            
            if (subsection.classList.contains('active')) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Toggle de prototipos
    if (prototypesHeader) {
        prototypesHeader.addEventListener('click', function() {
            const prototypeSubsection = document.querySelector('.prototype-subsection');
            const arrow = this.querySelector('.section-arrow');
            
            if (prototypeSubsection) {
                prototypeSubsection.classList.toggle('active');
                
                if (prototypeSubsection.classList.contains('active')) {
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
    
    // Toggle de apps
    if (appsHeader) {
        appsHeader.addEventListener('click', function() {
            const subSubsection = document.querySelector('.sub-subsection');
            const arrow = this.querySelector('.section-arrow');
            
            if (subSubsection) {
                subSubsection.classList.toggle('active');
                
                if (subSubsection.classList.contains('active')) {
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
});


// Cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Payment Method Logos
const paymentMethodLogos = {
    'Nequi': '../../../Marketplace/metodos de pago/Nequi.png',
    'Daviplata': '../../../Marketplace/metodos de pago/Daviplata.png',
    'Bancolombia': '../../../Marketplace/metodos de pago/Bancolombia.png',
    'Efecty': '../../../Marketplace/metodos de pago/Efecty.png',
    'Visa': '../../../Marketplace/metodos de pago/Visa.png',
    'Mastercard': '../../../Marketplace/metodos de pago/Mastercard.png',
    'PSE': '../../../Marketplace/metodos de pago/PSE.png'
};

// Cart button click
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openCartModal();
    });
}

// Search Functionality
const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.getElementById('searchInput');
const cancelIcon = document.querySelector('.cancel-icon');

const products = {
    'organizador magnético': '../../../Marketplace/productos/Organizador Magnético De Cables/producto-organizador-magnetico.html',
      'caja táctica': '../../../Marketplace/productos/Caja Táctica Para Munición 9mm/producto-caja-tactica.html',
      'cables cctv': '../../../Marketplace/productos/Caja Para Cables CCTV Cámaras De Seguridad/producto-caja-cables-cctv.html',
      'baluns': '../../../Marketplace/productos/Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales/producto-baluns-8-canales.html',
      'Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales': '../../../Marketplace/productos/Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales/producto-baluns-8-canales.html',
      'soporte qr': '../../../Marketplace/productos/Soporte QR/producto-soporte-qr.html',
};

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
    });
    
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
            searchIcon.classList.remove('active');
            searchInput.classList.remove('active');
            cancelIcon.classList.remove('active');
            searchInput.value = '';
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            const results = Object.keys(products).filter(product => product.includes(query));
            showSearchResults(results, products);
        } else {
            showSearchResults([], products);
        }
    });
}

function showSearchResults(results, products) {
    let dropdown = document.querySelector('.search-dropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 50px;
            left: 0;
            width: 100%;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            z-index: 9999;
            padding: 8px 0;
        `;
        searchBox.appendChild(dropdown);
    }
    
    if (results.length > 0) {
        dropdown.innerHTML = results.map(result => `
            <div style="padding: 12px 16px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 12px;" 
                 onmouseover="this.style.background='#f8f9fa'" 
                 onmouseout="this.style.background='white'"
                 onclick="window.location.href='${products[result]}'">
                <span style="color: #664AFF; font-size: 18px; line-height: 1;">★</span>
                <span style="color: #333; font-size: 14px; text-transform: capitalize; flex: 1;">${result}</span>
            </div>
        `).join('');
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// Cart Modal
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');

window.openCartModal = function() {
    updateCartUI();
    cartModal.style.display = 'block';
};

window.closeCartModal = function() {
    cartModal.style.display = 'none';
};

if (closeCart) {
    closeCart.addEventListener('click', () => {
        closeCartModal();
    });
}

if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
}

window.openPaymentModal = function() {
    selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'block';
        document.querySelectorAll('.payment-option').forEach(el => {
            el.classList.remove('selected');
            if (el.innerText.trim() === selectedPaymentMethod) el.classList.add('selected');
        });
    }
};

window.closePaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
};

window.selectPayment = function(method, element) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
};

window.confirmPaymentSelection = function() {
    if (selectedPaymentMethod) {
        localStorage.setItem('selectedPayment', selectedPaymentMethod);
        closePaymentModal();
        updateCartUI();
        if(window.showToast) {
            window.playSuccessSound();
            window.showToast('¡Método Confirmado!', 'Pago actualizado a: ' + selectedPaymentMethod);
        } else {
            alert('Método de pago actualizado: ' + selectedPaymentMethod);
        }
    } else {
        alert('Por favor selecciona un método de pago');
    }
};

window.removePaymentMethod = function() {
    selectedPaymentMethod = '';
    localStorage.removeItem('selectedPayment');
    updateCartUI();
};

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartPaymentMethod = document.getElementById('cartPaymentMethod');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.add('show');
    } else {
        cartCount.classList.remove('show');
    }
    
    if (totalItems === 0) {
        cartItems.innerHTML = '<p class="cart-empty">El carrito está vacío</p>';
        cartTotal.textContent = '$0 COP';
    } else {
        cartItems.innerHTML = '<div class="cart-items">' + cart.map((item, index) => {
            // Ajustar ruta de imagen según la ubicación actual
            let imagePath = item.image || '';
            
            // Si la ruta ya es absoluta o comienza con http, dejarla como está
            if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
                // No hacer nada
            } else if (imagePath.includes('Marketplace/')) {
                // Si ya contiene Marketplace/, extraer la parte después de Marketplace/
                const marketplaceIndex = imagePath.indexOf('Marketplace/');
                const relativePath = imagePath.substring(marketplaceIndex + 12); // 12 = length of 'Marketplace/'
                imagePath = '../../../Marketplace/' + relativePath;
            } else {
                // Si no tiene prefijo, asumir que es relativa al Marketplace
                imagePath = '../../../Marketplace/' + imagePath;
            }
            
            return `
            <div class="cart-item">
                <img src="${imagePath}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price > 0 ? '$' + item.price.toLocaleString('es-CO') + ' COP' : 'Cotización'}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">${item.price > 0 ? '$' + (item.price * item.quantity).toLocaleString('es-CO') + ' COP' : 'Cotización'}</div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `}).join('') + '</div>';
        
        if (totalPrice > 0) {
            cartTotal.textContent = '$' + totalPrice.toLocaleString('es-CO') + ' COP';
        } else {
            cartTotal.textContent = 'Cotización';
        }
    }

    // Update payment method display in cart
    const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    if (cartPaymentMethod) {
        if (selectedPaymentMethod) {
            const logoSrc = paymentMethodLogos[selectedPaymentMethod];
            let paymentHtml = '<div style="display: flex; align-items: center; gap: 8px;">';
            if (logoSrc) {
                paymentHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
            }
            paymentHtml += `<span style="font-weight: bold; color: #333;">${selectedPaymentMethod}</span>`;
            paymentHtml += `<button class="remove-payment-btn" onclick="event.stopPropagation(); removePaymentMethod()" title="Quitar método de pago" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-weight: bold; font-size: 1.2rem; margin-left: 10px;">&times;</button>`;
            paymentHtml += '</div>';
            cartPaymentMethod.innerHTML = paymentHtml;
        } else {
            cartPaymentMethod.innerHTML = '<span style="color: #f57c00; cursor: pointer;" onclick="closeCartModal(); openPaymentModal();">No seleccionado (Clic para elegir)</span>';
        }
    }
}

// WhatsApp Quote
const btnQuote = document.getElementById('btnQuote');
if (btnQuote) {
    btnQuote.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        
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

        const whatsappUrl = `https://wa.me/573113579437?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Update quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Initialize WhatsApp Widget
$(function () {
    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿En qué podemos ayudarte con 3DCost?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});

// Debug cart images
console.log('Cart items:', cart);
cart.forEach((item, index) => {
    console.log(`Item ${index}:`, {
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
    });
});
