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
    
    // Inicializar componentes compartidos
    PaymentModal.init({ basePath: '../metodos de pago/' });
    CartSystem.init({ imageBasePath: '../../' });
    
    // Conectar carrito del navbar
    $('.cart-icon').on('click', function() {
        CartSystem.open();
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

// Funciones globales para compatibilidad
window.addToCart = function(id, name, price, image) {
    CartSystem.addItem(id, name, price, image);
};

window.checkout = function() {
    const cart = CartSystem.getCart();
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
    const selectedPayment = PaymentModal.getSelectedPayment();
    if (selectedPayment) {
        message += `\n\nMétodo de Pago: ${selectedPayment}`;
    } else {
        message += `\n\nMétodo de Pago: A convenir`;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

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
