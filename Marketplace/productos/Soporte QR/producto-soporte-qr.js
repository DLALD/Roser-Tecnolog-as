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

$(document).ready(function() {
    initImageZoom();
});

window.changeMainImage = function(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const zoomImage = document.getElementById('zoomImage');
    
    mainImage.src = thumbnail.src;
    zoomImage.src = thumbnail.src;
    
    $('.thumbnail').removeClass('active');
    $(thumbnail).addClass('active');
};

window.addToCartProduct = function() {
    const quantity = parseInt($('#quantity').val()) || 1;
    const mainImage = document.getElementById('mainImage');
    const currentImage = mainImage.src;
    
    const productName = 'Soporte QR para Negocios';
    const productId = 'soporte-qr';
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName, 
            price: 98000, 
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

$(function () {
    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿Quieres un Soporte QR para tu negocio?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});