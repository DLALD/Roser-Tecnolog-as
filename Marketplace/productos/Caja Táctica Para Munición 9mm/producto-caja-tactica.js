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
    cartBody.html(html);
    $('#cart-total').text(`$${total.toLocaleString('es-CO')} COP`);
}

window.addToCartProduct = function() {
    const quantity = parseInt($('#quantity').val()) || 1;
    const mainImage = document.getElementById('mainImage');
    const currentImage = mainImage.src;
    
    const productName = 'Caja Táctica Para Munición 9mm Roser Tactical Tacbox M9-v1';
    const productId = 'caja-tactica';
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName, 
            price: 81400, 
            image: currentImage, 
            quantity: quantity 
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Animación del botón
    const btn = document.querySelector('.add-to-cart-btn');
    const originalText = btn.innerText;
    btn.classList.add('added');
    btn.innerText = '¡Agregado al Carrito!';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerText = originalText;
    }, 2000);
    
    // Sonido y Notificación
    if (window.notifyAddToCart) window.notifyAddToCart();
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
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

window.contactWhatsApp = function(productName) {
    const phone = '573113579437';
    const message = `¡Hola! Estoy interesado en el producto: ${productName}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

window.changeMainImage = function(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const zoomImage = document.getElementById('zoomImage');
    
    mainImage.src = thumbnail.src;
    zoomImage.src = thumbnail.src;
    
    $('.thumbnail').removeClass('active');
    $(thumbnail).addClass('active');
};

// Funcionalidad de zoom estilo Amazon
function initImageZoom() {
    const mainImageContainer = document.getElementById('mainImageContainer');
    const zoomLens = document.getElementById('zoomLens');
    const zoomResult = document.getElementById('zoomResult');
    const zoomImage = document.getElementById('zoomImage');
    
    if (!mainImageContainer) return;
    
    mainImageContainer.addEventListener('mousemove', function(e) {
        const rect = mainImageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const lensWidth = 150;
        const lensHeight = 150;
        
        let lensX = x - lensWidth / 2;
        let lensY = y - lensHeight / 2;
        
        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > rect.width - lensWidth) lensX = rect.width - lensWidth;
        if (lensY > rect.height - lensHeight) lensY = rect.height - lensHeight;
        
        zoomLens.style.left = lensX + 'px';
        zoomLens.style.top = lensY + 'px';
        
        const zoomFactor = 2.5;
        const zoomX = -(lensX * zoomFactor);
        const zoomY = -(lensY * zoomFactor);
        
        zoomImage.style.left = zoomX + 'px';
        zoomImage.style.top = zoomY + 'px';
        
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
    });
    
    mainImageContainer.addEventListener('mouseleave', function() {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });
}

$(function () {
    initImageZoom();
    updateCartCount();
    updateCartDisplay();
    
    $('#cart-button').click(function() {
        openCartModal();
    });

    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿Te interesa la Caja Táctica 9mm?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});