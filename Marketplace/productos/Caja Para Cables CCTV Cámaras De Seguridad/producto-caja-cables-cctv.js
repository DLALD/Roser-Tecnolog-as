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

window.changeMainImage = function(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const zoomImage = document.getElementById('zoomImage');
    
    mainImage.src = thumbnail.src;
    zoomImage.src = thumbnail.src;
    
    $('.thumbnail').removeClass('active');
    $(thumbnail).addClass('active');
};

let selectedColor = 'Negra';

const colorImages = {
    'Negra': ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'],
    'Gris': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    'Indigo': ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
};

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
        thumbnail.src = `Imagenes-Caja Para Cables CCTV/${color}/${img}`;
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
    mainImage.src = `Imagenes-Caja Para Cables CCTV/${color}/${images[0]}`;
    zoomImage.src = `Imagenes-Caja Para Cables CCTV/${color}/${images[0]}`;
};

window.openGalleryModal = function(color, images) {
    const modalBody = document.getElementById('galleryModalBody');
    modalBody.innerHTML = '';
    
    images.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = `Imagenes-Caja Para Cables CCTV/${color}/${img}`;
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

window.addToCartWithColor = function() {
    const quantity = parseInt($('#quantity').val()) || 1;
    const mainImage = document.getElementById('mainImage');
    const currentImage = mainImage.src;
    
    const productName = `Caja Para Cables CCTV Cámaras De Seguridad - ${selectedColor}`;
    const productId = `caja-cables-cctv-${selectedColor.toLowerCase()}`;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName, 
            price: 36900, 
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
    initImageZoom();

    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: '¡Hola! ¿Necesitas la Caja para Cables CCTV?',
        showPopup: true,
        position: "right",
        size: "60px",
        backgroundColor: '#25D366',
        zIndex: 9999
    });
});