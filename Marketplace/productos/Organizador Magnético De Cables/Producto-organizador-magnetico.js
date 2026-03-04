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

window.addToCart = function(id, name, price, image) {
    const quantity = parseInt($('#quantity').val()) || 1;
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, image, quantity });
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

window.addToCartWithColor = function() {
    const quantity = parseInt($('#quantity').val()) || 1;
    const mainImage = document.getElementById('mainImage');
    const currentImage = mainImage.src;
    
    const productName = `Organizador Magnético De Cables Hasta 80cm Hexastack H1-80 - ${selectedColor}`;
    const productId = `organizador-magnetico-${selectedColor.toLowerCase()}`;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName, 
            price: 61069, 
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

let selectedColor = 'Negro';

const colorImages = {
    'Negro': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'],
    'Blanco': ['1.jpg', '2.jpg', '3.jpg', '7.jpg', '8.jpg', '9.jpg'],
    'Plateado': ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    'Azul': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg'],
    'Rojo': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
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
    const mainImage = document.getElementById('mainImage');
    const zoomLens = document.getElementById('zoomLens');
    const zoomResult = document.getElementById('zoomResult');
    const zoomImage = document.getElementById('zoomImage');
    
    mainImageContainer.addEventListener('mousemove', function(e) {
        const rect = mainImageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Posicionar la lupa
        const lensWidth = 150;
        const lensHeight = 150;
        
        let lensX = x - lensWidth / 2;
        let lensY = y - lensHeight / 2;
        
        // Limitar la lupa dentro de la imagen
        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > rect.width - lensWidth) lensX = rect.width - lensWidth;
        if (lensY > rect.height - lensHeight) lensY = rect.height - lensHeight;
        
        zoomLens.style.left = lensX + 'px';
        zoomLens.style.top = lensY + 'px';
        
        // Calcular la posición del zoom
        const zoomFactor = 2.5;
        const zoomX = -(lensX * zoomFactor);
        const zoomY = -(lensY * zoomFactor);
        
        zoomImage.style.left = zoomX + 'px';
        zoomImage.style.top = zoomY + 'px';
        
        // Mostrar elementos de zoom
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
    });
    
    mainImageContainer.addEventListener('mouseleave', function() {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });
}

window.selectColor = function(button, color) {
    $('.color-circle').removeClass('active');
    $(button).addClass('active');
    
    selectedColor = color;
    
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    thumbnailGallery.innerHTML = '';
    
    const images = colorImages[color];
    const maxThumbnails = 6;
    const displayImages = images.slice(0, maxThumbnails);
    
    displayImages.forEach((img, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `Imagenes-Organizador/${color}/${img}`;
        thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        thumbnail.onclick = function() { changeMainImage(this); };
        thumbnailGallery.appendChild(thumbnail);
    });
    
    if (images.length > maxThumbnails) {
        const moreButton = document.createElement('div');
        moreButton.className = 'thumbnail-more';
        moreButton.innerHTML = `+${images.length - maxThumbnails}`;
        moreButton.onclick = function() { openGalleryModal(color, images); };
        thumbnailGallery.appendChild(moreButton);
    }
    
    const mainImage = document.getElementById('mainImage');
    const zoomImage = document.getElementById('zoomImage');
    mainImage.src = `Imagenes-Organizador/${color}/${images[0]}`;
    zoomImage.src = `Imagenes-Organizador/${color}/${images[0]}`;
};

window.openGalleryModal = function(color, images) {
    const modalBody = document.getElementById('galleryModalBody');
    modalBody.innerHTML = '';
    
    images.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = `Imagenes-Organizador/${color}/${img}`;
        imgElement.className = 'gallery-modal-img';
        imgElement.onclick = function() {
            document.getElementById('mainImage').src = this.src;
            document.getElementById('zoomImage').src = this.src;
            closeGalleryModal();
        };
        modalBody.appendChild(imgElement);
    });
    
    $('#galleryModal').show();
};

window.closeGalleryModal = function() {
    $('#galleryModal').hide();
};

$(function () {
    // Inicializar zoom cuando la página carga
    initImageZoom();

    $('#cart-button').click(function() {
        openCartModal();
    });
    
    updateCartCount();
    updateCartDisplay();

    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿Buscas organizar tus cables con HexaStack?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});