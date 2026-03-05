$(function () {
    // Esperar a que el navbar se genere
    setTimeout(() => {
        initializeApp();
    }, 100);
});

function initializeApp() {
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
    // Cart system
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    
    const paymentMethodLogos = Object.fromEntries(
        PaymentModal.methods.map(m => [m.name, m.logo])
    );
    
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('#cart-count').text(count);
        if (count > 0) {
            $('#cart-count').css('display', 'flex').addClass('show');
        } else {
            $('#cart-count').css('display', 'none').removeClass('show');
        }
    }
    
    function updateCartDisplay() {
        const cartBody = $('#cartBody');
        selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
        
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
            
            let imagePath = item.image;
            // Corregir la ruta de la imagen si es una ruta de archivo local absoluta
            const marketplaceToken = '/Marketplace/';
            if (imagePath && imagePath.includes(marketplaceToken)) {
                const decodedPath = decodeURIComponent(imagePath);
                const pathIndex = decodedPath.indexOf(marketplaceToken);
                if (pathIndex !== -1) {
                    const relativePath = decodedPath.substring(pathIndex + 1);
                    imagePath = '../' + relativePath;
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
        
        // Update payment display in cart
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
            $('#cartPaymentMethod').html('<span style="color: #f57c00; cursor: pointer;" onclick="selectPaymentMethod();">No seleccionado (Clic para elegir)</span>');
        }
    }
    
    // Cart functionality
    $('.cart-icon').click(function() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartDisplay();
        $('#cartModal').show();
    });
    
    $('.close').click(function() {
        $('#cartModal').hide();
    });
    
    $(window).click(function(event) {
        if (event.target.id === 'cartModal') {
            $('#cartModal').hide();
        }
    });
    
    // Search functionality
    const searchBox = $('.search-box');
    const searchIcon = $('.search-icon');
    const searchInput = $('.search-box input');
    const cancelIcon = $('.cancel-icon');
    
    // Product database
const products = getProductRoutes('../');
    
    searchIcon.click(function() {
        searchBox.addClass('active');
        searchIcon.addClass('active');
        searchInput.addClass('active');
        cancelIcon.addClass('active');
        searchInput.focus();
    });
    
    cancelIcon.click(function() {
        searchBox.removeClass('active');
        searchIcon.removeClass('active');
        searchInput.removeClass('active');
        cancelIcon.removeClass('active');
        searchInput.val('');
        hideSearchResults();
    });
    
    searchInput.on('input', function() {
        const query = $(this).val().toLowerCase();
        if (query.length > 0) {
            const results = Object.keys(products).filter(product => 
                product.includes(query)
            );
            showSearchResults(results, products);
        } else {
            hideSearchResults();
        }
    });
    
    function showSearchResults(results, products) {
        let dropdown = $('.search-dropdown');
        
        if (dropdown.length === 0) {
            dropdown = $('<div class="search-dropdown"></div>');
            dropdown.css({
                'position': 'absolute',
                'top': '55px',
                'left': '0',
                'width': '100%',
                'background': 'white',
                'border': '1px solid #e0e0e0',
                'border-radius': '8px',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
                'max-height': '300px',
                'overflow-y': 'auto',
                'z-index': '9999',
                'padding': '8px 0'
            });
            searchBox.append(dropdown);
        }
        
        if (results.length > 0) {
            let html = '';
            results.forEach(result => {
                html += `
                    <div class="search-result-item" data-url="${products[result]}" style="
                        padding: 12px 16px;
                        cursor: pointer;
                        transition: background 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        border-bottom: 1px solid #f0f0f0;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#664AFF">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span style="color: #333; font-size: 14px; text-transform: capitalize; flex: 1;">${result}</span>
                    </div>
                `;
            });
            dropdown.html(html).show();
            
            $('.search-result-item').hover(
                function() { $(this).css('background', '#f8f9fa'); },
                function() { $(this).css('background', 'white'); }
            ).click(function() {
                const url = $(this).data('url');
                window.location.href = url;
            });
        } else {
            dropdown.hide();
        }
    }
    
    function hideSearchResults() {
        $('.search-dropdown').hide();
    }
    
    // Close search when clicking outside
    $(document).click(function(e) {
        if (!searchBox[0].contains(e.target)) {
            searchBox.removeClass('active');
            searchIcon.removeClass('active');
            searchInput.removeClass('active');
            cancelIcon.removeClass('active');
            searchInput.val('');
            hideSearchResults();
        }
    });
    
    // Initialize cart and update periodically
    updateCartCount();
    
    setInterval(function() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount();
    }, 1000);
    
    // Contact form functionality
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        let whatsappMessage = `Hola Roser Tecnologías, me contacto desde el sitio web:\n\n`;
        whatsappMessage += `Nombre: ${name}\n`;
        whatsappMessage += `Email: ${email}\n`;
        whatsappMessage += `Mensaje: ${message}`;
        
        const whatsappUrl = `https://wa.me/573113579437?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    });

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

    window.removePaymentMethod = function() {
        selectedPaymentMethod = '';
        localStorage.removeItem('selectedPayment');
        updateCartDisplay();
    };

    window.selectPaymentMethod = function() {
        PaymentModal.open((method) => {
            selectedPaymentMethod = method;
            updateCartDisplay();
        });
    };
}

function closeCartModal() {
    $('#cartModal').hide();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
    
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
}