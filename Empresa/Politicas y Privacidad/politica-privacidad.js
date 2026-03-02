document.addEventListener('DOMContentLoaded', function(){
    // --- Lógica del Menú Lateral (Sidebar) ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuButton = document.querySelector('.menu-button');
    const sidebarDropdown = document.querySelector('.sidebar-dropdown');
    const sectionHeaders = document.querySelectorAll('.section-header');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    if (menuButton && sidebarDropdown) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarDropdown.classList.toggle('active');
        });
    }

    sectionHeaders.forEach(sectionHeader => {
        sectionHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            const subsection = sectionHeader.nextElementSibling;
            const sectionArrow = sectionHeader.querySelector('.section-arrow');
            if (subsection) {
                subsection.classList.toggle('active');
                if (sectionArrow) {
                    sectionArrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    });

    document.querySelectorAll('.apps-header, .prototypes-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const subsection = header.nextElementSibling;
            const arrow = header.querySelector('.section-arrow');
            if (subsection) {
                subsection.classList.toggle('active');
                if (arrow) {
                    arrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (menuButton && sidebarDropdown && !menuButton.contains(e.target) && !sidebarDropdown.contains(e.target)) {
            sidebarDropdown.classList.remove('active');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));

    // Close sidebar dropdown when clicking on a link
    document.querySelectorAll('.sidebar-dropdown a:not(.apps-header)').forEach(n => n.addEventListener('click', () => {
        if (sidebarDropdown) {
            sidebarDropdown.classList.remove('active');
        }
    }));

    // --- Lógica del Carrito ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('shared-cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.classList.toggle('show', count > 0);
        }
    }

    function updateCartDisplay() {
        const cartBodyEl = document.getElementById('cartBody');
        if (!cartBodyEl) return;

        if (cart.length === 0) {
            cartBodyEl.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            const cartTotalEl = document.getElementById('cart-total');
            if (cartTotalEl) cartTotalEl.textContent = '$0 COP';
            return;
        }

        let html = '<div class="cart-items">';
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Ajustar ruta de la imagen para la ubicación actual (Empresa/Politicas y Privacidad/)
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
        cartBodyEl.innerHTML = html;
        const cartTotalEl = document.getElementById('cart-total');
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toLocaleString('es-CO')} COP`;
    }

    window.addToCart = function(id, name, price, image) {
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        updateCartDisplay();
        if (typeof window.notifyAddToCart === 'function') {
            window.notifyAddToCart();
        } else {
            alert('Producto agregado al carrito');
        }
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
    };

    window.increaseQuantity = function(index) {
        cart[index].quantity++;
        saveCart();
        updateCartCount();
        updateCartDisplay();
    };

    window.decreaseQuantity = function(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        } else {
            removeFromCart(index);
        }
    };

    window.openCartModal = function() {
        updateCartDisplay();
        const modal = document.getElementById('cartModal');
        if (modal) modal.style.display = 'block';
    };

    window.closeCartModal = function() {
        const modal = document.getElementById('cartModal');
        if (modal) modal.style.display = 'none';
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

        const currentPaymentMethod = localStorage.getItem('selectedPayment') || '';
        message += currentPaymentMethod ? `\n\nMétodo de Pago: ${currentPaymentMethod}` : `\n\nMétodo de Pago: A convenir`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Sincronizar carrito con otras pestañas
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            updateCartDisplay();
        }
    });

    // Cerrar modal con clic exterior o tecla ESC
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('cartModal');
        if (modal && e.target === modal) {
            closeCartModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeCartModal();
        }
    });
    
    // Asignar evento al botón de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-btn');
    if(checkoutBtn) checkoutBtn.addEventListener('click', window.checkout);

    // Carga inicial
    updateCartCount();
});

// Payment Methods Logic
let currentPaymentSelection = '';
const paymentMethodLogos = {
    'Nequi': '../../Marketplace/metodos de pago/Nequi.png',
    'Daviplata': '../../Marketplace/metodos de pago/Daviplata.png',
    'Bancolombia': '../../Marketplace/metodos de pago/Bancolombia.png',
    'Efecty': '../../Marketplace/metodos de pago/Efecty.png',
    'Visa': '../../Marketplace/metodos de pago/Visa.png',
    'Mastercard': '../../Marketplace/metodos de pago/Mastercard.png',
    'PSE': '../../Marketplace/metodos de pago/PSE.png'
};

window.openPaymentModal = function() {
    const saved = localStorage.getItem('selectedPayment') || '';
    currentPaymentSelection = saved;
    
    if (window.$) {
        $('#paymentModal').fadeIn(300);
    } else {
        const modal = document.getElementById('paymentModal');
        if (modal) modal.style.display = 'block';
    }
    
    if(currentPaymentSelection) {
        if (window.$) {
            $('.payment-option').removeClass('selected');
            $('.payment-option').each(function() {
                if($(this).find('div').text().trim() === currentPaymentSelection) {
                    $(this).addClass('selected');
                }
            });
        } else {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.querySelector('div').textContent.trim() === currentPaymentSelection) {
                    opt.classList.add('selected');
                }
            });
        }
    }
};

window.closePaymentModal = function() {
    if (window.$) {
        $('#paymentModal').fadeOut(300);
    } else {
        const modal = document.getElementById('paymentModal');
        if (modal) modal.style.display = 'none';
    }
};

window.selectPayment = function(method, element) {
    currentPaymentSelection = method;
    if (window.$) {
        $('.payment-option').removeClass('selected');
        $(element).addClass('selected');
    } else {
        document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    }
};

window.confirmPaymentSelection = function() {
    if(currentPaymentSelection) {
        localStorage.setItem('selectedPayment', currentPaymentSelection);
        closePaymentModal();
        updatePaymentDisplay();
        if(window.showToast) {
            window.playSuccessSound();
            window.showToast('¡Método Confirmado!', 'Pago actualizado a: ' + currentPaymentSelection);
        } else {
            alert('Método de pago actualizado: ' + currentPaymentSelection);
        }
    } else {
        alert('Por favor selecciona un método de pago');
    }
};

window.removePaymentMethod = function() {
    localStorage.removeItem('selectedPayment');
    updatePaymentDisplay();
};

window.updatePaymentDisplay = function() {
    const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    const container = document.getElementById('cartPaymentMethod');
    
    if (!container) return;
    
    let htmlContent = '';
    if(selectedPaymentMethod) {
        const logoSrc = paymentMethodLogos[selectedPaymentMethod];
        htmlContent = '<div style="display: flex; align-items: center; gap: 8px;">';
        if (logoSrc) {
            htmlContent += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
        }
        htmlContent += `<span>${selectedPaymentMethod}</span>`;
        htmlContent += `<button class="remove-payment-btn" onclick="event.stopPropagation(); removePaymentMethod()" title="Quitar método">&times;</button></div>`;
    } else {
        htmlContent = '<span style="color: #f57c00; cursor: pointer;">No seleccionado (Clic para elegir)</span>';
    }
    
    container.innerHTML = htmlContent;
};

// Initialize visualization and WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    if (typeof updatePaymentDisplay === 'function') updatePaymentDisplay();
    
    if (window.$ && $.fn.floatingWhatsApp) {
        $('#BotonWA').floatingWhatsApp({
            phone: '573113579437',
            headerTitle: 'Roser Tecnologías',
            popupMessage: '¡Hola! ¿En qué podemos ayudarte?',
            showPopup: true,
            position: "right",
            size: "60px",
            backgroundColor: '#25D366',
            zIndex: 9999
        });
    }
});
