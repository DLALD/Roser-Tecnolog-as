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

const allImages = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'];

window.openGalleryModal = function() {
    const modalBody = document.getElementById('galleryModalBody');
    modalBody.innerHTML = '';
    
    allImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = `Imagenes-Baluns Y Borneras Caja Para Cables/${img}`;
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

window.addToCartProduct = function() {
    const quantity = parseInt($('#quantity').val()) || 1;
    const mainImage = document.getElementById('mainImage');
    const currentImage = mainImage.src;
    
    const productName = 'Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales';
    const productId = 'baluns-8-canales';
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName, 
            price: 49800, 
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
        popupMessage: '¡Hola! ¿Preguntas sobre la Caja Baluns 8 Canales?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});