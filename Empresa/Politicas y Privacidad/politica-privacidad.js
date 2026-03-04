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

    // Search functionality
    const searchBox = document.querySelector(".search-box");
    const searchIcon = document.querySelector(".search-icon");
    const searchInput = document.querySelector("#shared-search-input");

    // Verificar que product-routes.js esté cargado
    if (typeof getProductRoutes !== 'function') {
        console.error('getProductRoutes no está definido. Verifica que product-routes.js esté cargado.');
    }

    const products = typeof getProductRoutes === 'function' ? getProductRoutes('../../') : {};
    console.log('Productos cargados:', products);

    if (searchBox && searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            searchBox.classList.add('active');
            searchIcon.classList.add('active');
            searchInput.classList.add('active');
            searchInput.focus();
        });
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                const results = Object.keys(products).filter(product => 
                    product.includes(query)
                );
                showSearchResults(results, products);
            } else {
                hideSearchResults();
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
        
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                searchBox.classList.remove('active');
                searchIcon.classList.remove('active');
                searchInput.classList.remove('active');
                searchInput.value = '';
                hideSearchResults();
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
                     onclick="window.location.href='${products[result]}'">
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

    function hideSearchResults() {
        const dropdown = document.querySelector('.search-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

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
