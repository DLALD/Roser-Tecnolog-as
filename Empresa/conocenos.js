// Mobile menu toggle
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

// Menu button toggle
if (menuButton && sidebarDropdown) {
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebarDropdown.classList.toggle('active');
    });
}

// Section headers toggle
sectionHeaders.forEach(sectionHeader => {
    sectionHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        const subsection = sectionHeader.nextElementSibling;
        const sectionArrow = sectionHeader.querySelector('.section-arrow');
        
        subsection.classList.toggle('active');
        if (sectionArrow) {
            sectionArrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });
});

// Apps header toggle
document.querySelectorAll('.apps-header').forEach(appsHeader => {
    appsHeader.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const subSubsection = appsHeader.nextElementSibling;
        const sectionArrow = appsHeader.querySelector('.section-arrow');
        
        if (subSubsection && subSubsection.classList.contains('sub-subsection')) {
            subSubsection.classList.toggle('active');
            if (sectionArrow) {
                sectionArrow.style.transform = subSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    });
});

// Prototypes header toggle
document.querySelectorAll('.prototypes-header').forEach(prototypesHeader => {
    prototypesHeader.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const prototypeSubsection = prototypesHeader.nextElementSibling;
        const sectionArrow = prototypesHeader.querySelector('.section-arrow');
        
        if (prototypeSubsection && prototypeSubsection.classList.contains('prototype-subsection')) {
            prototypeSubsection.classList.toggle('active');
            if (sectionArrow) {
                sectionArrow.style.transform = prototypeSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
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

// Photo enlargement animation
document.querySelectorAll('.member-photo img').forEach(img => {
    img.addEventListener('click', function() {
        // Remove enlarged class from all images
        document.querySelectorAll('.member-photo img').forEach(otherImg => {
            if (otherImg !== this) {
                otherImg.classList.remove('enlarged');
            }
        });
        
        // Toggle enlarged class on clicked image
        this.classList.toggle('enlarged');
        
        // Remove enlarged class after 3 seconds
        if (this.classList.contains('enlarged')) {
            setTimeout(() => {
                this.classList.remove('enlarged');
            }, 3000);
        }
    });
    
    // Remove enlarged class when mouse leaves the image
    img.addEventListener('mouseleave', function() {
        this.classList.remove('enlarged');
    });
});

// Smooth scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe team members
document.querySelectorAll('.team-member').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Search functionality
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector("#shared-search-btn");
const searchInput = document.querySelector("#shared-search-input");
const searchResults = document.querySelector("#search-results");

const products = [
    { name: "Organizador Magnético de Cables HexaStack H1-80", url: "../Marketplace/productos/producto-organizador-magnetico.html" },
    { name: "Caja Táctica para Munición 9mm", url: "../Marketplace/productos/producto-caja-tactica.html" },
    { name: "Organizador de Cables CCTV 4 Canales", url: "../Marketplace/productos/producto-caja-cables-cctv.html" },
    { name: "Baluns CCTV 8 Canales", url: "../Marketplace/productos/producto-baluns-8-canales.html" },
    { name: "Soporte QR para Negocios", url: "../Marketplace/productos/producto-soporte-qr.html" }
];

if (searchBtn && searchInput && searchBox && searchResults) {
    searchBtn.onclick = () => {
        searchBox.classList.add("active");
        searchBtn.classList.add("active");
        searchInput.classList.add("active");
        searchInput.focus();
    };
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            searchResults.classList.remove("show");
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        if (filteredProducts.length === 0) {
            searchResults.classList.remove("show");
            return;
        }
        
        let html = '';
        filteredProducts.forEach(product => {
            html += `
                <div class="search-result-item" onclick="window.location.href='${product.url}'">
                    <svg class="search-result-icon" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${product.name}
                </div>
            `;
        });
        
        searchResults.innerHTML = html;
        searchResults.classList.add("show");
    });
    
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove("active");
            searchBtn.classList.remove("active");
            searchInput.classList.remove("active");
            searchResults.classList.remove("show");
            searchInput.value = "";
        }
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('shared-cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
        if (count > 0) {
            cartCountEl.style.display = 'flex';
        } else {
            cartCountEl.style.display = 'none';
        }
    }
}

const cartButton = document.getElementById('shared-cart-button');
if (cartButton) {
    cartButton.addEventListener('click', () => {
        if (typeof openCartModal === 'function') {
            openCartModal();
        } else {
            window.location.href = '../Marketplace/marketplace.html';
        }
    });
}

updateCartCount();

// Cart display and actions (adapted from Marketplace)
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
    cartBodyEl.innerHTML = html;
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

window.addToCart = function(id, name, price, image) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, name, price, image, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    alert('Producto agregado al carrito');
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

window.increaseQuantity = function(index) {
    cart[index].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

window.decreaseQuantity = function(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

window.openCartModal = function() {
    updateCartDisplay();
    if (window.$) $('#cartModal').show();
    else document.getElementById('cartModal').style.display = 'block';
}

window.closeCartModal = function() {
    if (window.$) $('#cartModal').hide();
    else document.getElementById('cartModal').style.display = 'none';
}

window.checkout = function() {
    if (cart.length === 0) { alert('Tu carrito está vacío'); return; }
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
}

window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        cart = JSON.parse(e.newValue) || [];
        updateCartCount();
    }
});

// Close modal when clicking outside content or pressing ESC
(function() {
    const modalSelector = '#cartModal';

    function hideModal() {
        if (window.$) $(modalSelector).hide();
        else {
            const m = document.querySelector(modalSelector);
            if (m) m.style.display = 'none';
        }
    }

    function onOverlayClick(e) {
        const modal = document.querySelector(modalSelector);
        if (!modal) return;
        if (e.target === modal) hideModal();
    }

    function onKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') hideModal();
    }

    if (window.$) {
        $(document).on('click', function(e) { onOverlayClick(e); });
        $(document).on('keydown', function(e) { onKeyDown(e); });
    } else {
        document.addEventListener('click', onOverlayClick);
        document.addEventListener('keydown', onKeyDown);
    }
})();