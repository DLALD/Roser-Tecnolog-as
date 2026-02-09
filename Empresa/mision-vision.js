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

// Observe cards and values
document.querySelectorAll('.mission-card, .vision-card, .value-item').forEach(el => {
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
        window.location.href = '../Marketplace/marketplace.html';
    });
}

updateCartCount();

window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        cart = JSON.parse(e.newValue) || [];
        updateCartCount();
    }
});