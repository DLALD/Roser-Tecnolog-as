$(function () {
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
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const contenedor = document.querySelector('.marketplace-content');
    
    if (navbar && contenedor) {
        window.addEventListener('scroll', function(){
            if(contenedor.getBoundingClientRect().top < 10){
                navbar.classList.add('scroll');
            }
            else{
                navbar.classList.remove('scroll');
            }
        });
    }
    
    // Función unificada de filtrado
    function filterProducts() {
        const activeCategoryBtn = $('.category-link.active');
        
        const minPrice = parseInt($('#minPrice').val().replace(/\./g, '')) || 0;
        const maxPrice = parseInt($('#maxPrice').val().replace(/\./g, '')) || 999999999;
        
        $('.product-item').each(function() {
            const item = $(this);
            const priceText = item.find('.product-price').text();
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const matchesPrice = price >= minPrice && price <= maxPrice;
            
            let matchesContext = true;
            
            if (activeCategoryBtn.length) {
                const category = activeCategoryBtn.data('category');
                const itemCategories = item.data('category') || '';
                matchesContext = category === 'all' || itemCategories.includes(category);
            }
            
            if (matchesContext && matchesPrice) {
                item.fadeIn();
            } else {
                item.fadeOut();
            }
        });
    }
    
    // Categories filter functionality
    $('.category-link').click(function(e) {
        e.preventDefault();
        const category = $(this).data('category');
        const categoryName = $(this).find('span').text();
        
        // Update active button
        $('.category-link').removeClass('active');
        $(this).addClass('active');
        
        // Update title
        $('.marketplace-content h2').text(category === 'all' ? 'Productos Disponibles' : categoryName);
        
        filterProducts();
    });
    
    // Funcionalidad de búsqueda animada
    const searchBox = document.querySelector(".search-box");
    const searchBtn = document.querySelector(".search-icon");
    const cancelBtn = document.querySelector(".cancel-icon");
    const searchInput = document.querySelector(".search-box input");
    
    if (searchBtn) {
        searchBtn.onclick = () => {
            searchBox.classList.add("active");
            searchBtn.classList.add("active");
            searchInput.classList.add("active");
            cancelBtn.classList.add("active");
            searchInput.focus();
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            searchBox.classList.remove("active");
            searchBtn.classList.remove("active");
            searchInput.classList.remove("active");
            cancelBtn.classList.remove("active");
            searchInput.value = "";
            $('.product-item').show();
        };
    }
    
    // Funcionalidad de búsqueda
    $(searchInput).on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.product-item').each(function() {
            const productName = $(this).find('h3').text().toLowerCase();
            const productDesc = $(this).find('.product-description').text().toLowerCase();
            
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Sidebar toggle functionality
    $('#sidebar-toggle').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = $('.sidebar-dropdown');
        dropdown.toggleClass('active');
    });
    
    // Categories button functionality
    $('.categories-btn').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');
        
        sidebar.addClass('open');
        overlay.addClass('active');
    });
    
    // Sidebar close button
    $('#sidebar-close').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');
        
        sidebar.removeClass('open');
        overlay.removeClass('active');
    });
    
    // Cerrar dropdown al hacer clic fuera
    $(document).click(function(e) {
        if (!$(e.target).closest('#sidebar-toggle, .sidebar-dropdown').length) {
            $('.sidebar-dropdown').removeClass('active');
        }
    });
    
    // Close sidebar when clicking overlay
    $('#sidebar-overlay').click(function() {
        $('#sidebar').removeClass('open');
        $(this).removeClass('active');
    });
    
    // Close sidebar when clicking a link (mobile)
    $('.sidebar-link').click(function() {
        if (window.innerWidth <= 768) {
            $('#sidebar').removeClass('open');
            $('#sidebar-overlay').removeClass('active');
        }
    });
    
    // Dropdown section toggle functionality
    $('.section-header').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const subsection = $(this).next('.subsection');
        const arrow = $(this).find('.section-arrow');
        
        subsection.toggleClass('active');
        arrow.css('transform', subsection.hasClass('active') ? 'rotate(180deg)' : 'rotate(0deg)');
    });
    
    // Prototypes header toggle
    $('.prototypes-header').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const subsection = $(this).next('.prototype-subsection');
        const arrow = $(this).find('.section-arrow');
        
        subsection.toggleClass('active');
        arrow.css('transform', subsection.hasClass('active') ? 'rotate(180deg)' : 'rotate(0deg)');
    });
    
    // Apps header toggle
    $('.apps-header').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const subsection = $(this).next('.sub-subsection');
        const arrow = $(this).find('.section-arrow');
        
        subsection.toggleClass('active');
        arrow.css('transform', subsection.hasClass('active') ? 'rotate(180deg)' : 'rotate(0deg)');
    });

    // Animación escalonada para productos
    $('.product-item').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
    
    // Filtro de precio automático al escribir
    $('#minPrice, #maxPrice').on('input', function() {
        // Formatear con puntos de miles
        let value = $(this).val().replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('es-CO');
        }
        $(this).val(value);
        filterProducts();
    });
    
    // Funcionalidad de limpiar filtros
    $('#clearFiltersBtn').click(function() {
        // Resetear inputs
        $('#minPrice').val('');
        $('#maxPrice').val('');
        
        // Resetear categorías a "Todos"
        $('.category-link').removeClass('active');
        $('.category-link[data-category="all"]').addClass('active');
        $('.marketplace-content h2').text('Productos Disponibles');
        
        filterProducts();
        
        if (window.innerWidth <= 768) {
            $('#sidebar').removeClass('open');
            $('#sidebar-overlay').removeClass('active');
        }
    });
});

// Product modal functions
window.openProductModal = function(productId) {
    const modal = $('#productModal');
    const modalBody = $('#modalBody');
    
    modalBody.html('');
    let productContent = '';
    
    switch(productId) {
        case 'organizador-magnetico':
            productContent = `
                <div class="modal-product">
                    <div class="modal-gallery">
                        <img src="../Marketplace/Organizador Magnético De Cables Hasta 80cm Hexastack H1-80/Negro/1.jpg" alt="Organizador Magnético" class="modal-main-img">
                    </div>
                    <div class="modal-details">
                        <h2>Organizador Magnético De Cables Hasta 80cm Hexastack H1-80</h2>
                        <div class="modal-price">$61.069 COP</div>
                        <div class="modal-description">
                            <p>Organizador magnético de cables hasta 80cm, disponible en 5 colores.</p>
                        </div>
                        <button class="whatsapp-btn" onclick="contactWhatsApp('Organizador Magnético Hexastack H1-80')">Contactar por WhatsApp</button>
                        <button class="add-to-cart-btn" onclick="addToCart('organizador-magnetico', 'Organizador Magnético De Cables Hasta 80cm Hexastack H1-80', 61069, '../Marketplace/Organizador Magnético De Cables Hasta 80cm Hexastack H1-80/Negro/1.jpg')">Agregar al Carrito</button>
                    </div>
                </div>
            `;
            break;
        default:
            productContent = '<p>Producto no encontrado</p>';
    }
    
    modalBody.html(productContent);
    modal.show();
};

window.closeProductModal = function() {
    $('#productModal').hide();
};

window.contactWhatsApp = function(productName) {
    const phone = '573113579437';
    const message = `¡Hola! Estoy interesado en el producto: ${productName}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Payment Method Logic
const paymentMethodLogos = {
    'Nequi': '../metodos de pago/Nequi.png',
    'Daviplata': '../metodos de pago/Daviplata.png',
    'Bancolombia': '../metodos de pago/Bancolombia.png',
    'Efecty': '../metodos de pago/Efecty.png',
    'Visa': '../metodos de pago/Visa.png',
    'Mastercard': '../metodos de pago/Mastercard.png',
    'PSE': '../metodos de pago/PSE.png'
};
let selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';

if(selectedPaymentMethod) {
    const logoSrc = paymentMethodLogos[selectedPaymentMethod];
    let sidebarHtml = '';
    if (logoSrc) {
        sidebarHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 20px; vertical-align: middle; margin-right: 5px;">`;
    }
    sidebarHtml += `<span style="vertical-align: middle;">${selectedPaymentMethod}</span>`;
    $('#sidebarPaymentDisplay').html(sidebarHtml).css('color', '#4CAF50');
}

window.openPaymentModal = function() {
    $('#paymentModal').fadeIn(300);
    if(selectedPaymentMethod) {
        $('.payment-option').each(function() {
            if($(this).find('div').text() === selectedPaymentMethod) {
                $(this).addClass('selected');
            }
        });
    }
};

window.closePaymentModal = function() {
    $('#paymentModal').fadeOut(300);
};

window.selectPayment = function(method, element) {
    selectedPaymentMethod = method;
    $('.payment-option').removeClass('selected');
    $(element).addClass('selected');
};

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
    $('.toast-notification').remove();
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';
    
    const html = `
        <div class="toast-notification ${type}">
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        </div>
    `;
    $('body').append(html);
    if (type === 'success') playNotificationSound();
    setTimeout(() => { $('.toast-notification').addClass('show'); }, 10);
    setTimeout(() => {
        $('.toast-notification').removeClass('show');
        setTimeout(() => { $('.toast-notification').remove(); }, 400);
    }, 3000);
};

window.confirmPaymentSelection = function() {
    if(selectedPaymentMethod) {
        localStorage.setItem('selectedPayment', selectedPaymentMethod);
        const logoSrc = paymentMethodLogos[selectedPaymentMethod];
        let sidebarHtml = '';
        if (logoSrc) {
            sidebarHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 20px; vertical-align: middle; margin-right: 5px;">`;
        }
        sidebarHtml += `<span style="vertical-align: middle;">${selectedPaymentMethod}</span>`;
        $('#sidebarPaymentDisplay').html(sidebarHtml).css('color', '#4CAF50');
        closePaymentModal();
        showNotification('¡Método Confirmado!', 'Pago actualizado a: ' + selectedPaymentMethod, 'success');
    } else {
        showNotification('Atención', 'Por favor selecciona un método de pago', 'info');
    }
};

window.removePaymentMethod = function() {
    selectedPaymentMethod = '';
    localStorage.removeItem('selectedPayment');
    $('#sidebarPaymentDisplay').text('Seleccionar Método').css('color', '#1976d2');
    updateCartDisplay();
    showNotification('Método Eliminado', 'Se ha quitado el método de pago.', 'error');
};

// Cart system
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-count').text(count);
    if (count > 0) {
        $('#cart-count').show();
    } else {
        $('#cart-count').hide();
    }
}

function updateCartDisplay() {
    const cartBody = $('#cartBody');
    if (cart.length === 0) {
        cartBody.html('<p class="empty-cart">Tu carrito está vacío</p>');
        $('#cart-total').text('$0 COP');
        return;
    }
    let html = '<div class="cart-items">';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        let imagePath = item.image || '';
        if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
            if (imagePath.includes('Marketplace/')) {
                const parts = imagePath.split('Marketplace/');
                imagePath = '../../Marketplace/' + parts[1];
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
    cartBody.html(html);
    $('#cart-total').text(`$${total.toLocaleString('es-CO')} COP`);
    
    if(selectedPaymentMethod) {
        const logoSrc = paymentMethodLogos[selectedPaymentMethod];
        let paymentHtml = '<div style="display: flex; align-items: center; gap: 8px;">';
        if (logoSrc) {
            paymentHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
        }
        paymentHtml += `<span style="font-weight: bold; color: #333;">${selectedPaymentMethod}</span>`;
        paymentHtml += `<button class="remove-payment-btn" onclick="removePaymentMethod()" title="Quitar método de pago">&times;</button>`;
        paymentHtml += '</div>';
        $('#cartPaymentMethod').html(paymentHtml);
    } else {
        $('#cartPaymentMethod').html('<span style="color: #f57c00; cursor: pointer;" onclick="closeCartModal(); openPaymentModal();">No seleccionado (Clic para elegir)</span>');
    }
}

window.addToCart = function(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
        existingItem.image = image; // Actualizar imagen por si cambió la ruta
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
    $('#cartModal').show();
};

window.closeCartModal = function() {
    $('#cartModal').hide();
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
    if (selectedPaymentMethod) {
        message += `\n\nMétodo de Pago: ${selectedPaymentMethod}`;
    } else {
        message += `\n\nMétodo de Pago: A convenir`;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

$('.cart-icon').click(function() {
    openCartModal();
});

updateCartCount();
updateCartDisplay();

window.openImageZoom = function(imageSrc, altText) {
    const modal = $('#imageZoomModal');
    const zoomImage = $('#zoomImage');
    zoomImage.attr('src', imageSrc);
    zoomImage.attr('alt', altText);
    modal.show();
};

window.closeImageZoom = function() {
    $('#imageZoomModal').hide();
};

$(document).on('mousemove', '.zoom-container', function(e) {
    const container = $(this);
    const lens = container.find('.zoom-lens');
    const image = container.find('#zoomImage');
    const containerOffset = container.offset();
    const x = e.pageX - containerOffset.left;
    const y = e.pageY - containerOffset.top;
    const lensSize = 300;
    lens.css({
        left: (x - lensSize/2) + 'px',
        top: (y - lensSize/2) + 'px'
    });
    const zoomFactor = 2.5;
    const percentX = ((x - 5) / container.width()) * 100;
    const percentY = ((y - 5) / container.height()) * 100;
    image.css({
        'transform-origin': percentX + '% ' + percentY + '%',
        'transform': 'scale(' + zoomFactor + ')'
    });
    lens.show();
});

$(document).on('mouseleave', '.zoom-container', function() {
    const image = $(this).find('#zoomImage');
    const lens = $(this).find('.zoom-lens');
    image.css({
        'transform': 'scale(1)',
        'transform-origin': 'center center'
    });
    lens.hide();
});

$(document).keydown(function(e) {
    if (e.keyCode === 27) {
        closeImageZoom();
    }
});

$('#imageZoomModal').click(function(e) {
    if (e.target === this) {
        closeImageZoom();
    }
});