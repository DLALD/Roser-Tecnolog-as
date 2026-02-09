// Componentes compartidos para todas las páginas
function addSharedComponents() {
    // Agregar estilos compartidos si no existen
    if (!document.getElementById('shared-styles')) {
        const sharedStyles = document.createElement('style');
        sharedStyles.id = 'shared-styles';
        sharedStyles.textContent = `
            /* Estilos compartidos para búsqueda y carrito */
            .search-box {
                position: relative;
                height: 50px;
                width: 50px;
                border-radius: 50%;
                box-shadow: 0 5px 25px rgba(0,0,0,0.2);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .search-box.active {
                width: 350px;
            }
            
            .search-box input {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 50px;
                background: #fff;
                outline: none;
                padding: 0 60px 0 20px;
                font-size: 16px;
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .search-box input.active {
                opacity: 1;
            }
            
            .search-box .search-icon {
                position: absolute;
                right: 0px;
                top: 50%;
                transform: translateY(-50%);
                height: 50px;
                width: 50px;
                background: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 50px;
                cursor: pointer;
                z-index: 1;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .search-box .search-icon svg {
                width: 20px;
                height: 20px;
                fill: #664AFF;
            }
            
            .search-box .search-icon.active {
                right: 5px;
                height: 40px;
                width: 40px;
                background: #664AFF;
                transform: translateY(-50%) rotate(360deg);
            }
            
            .search-box .search-icon.active svg {
                fill: #fff;
            }
            
            .cart-button {
                position: relative;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cart-button:hover {
                background: rgba(0,0,0,0.1);
            }
            
            .cart-icon {
                width: 24px;
                height: 24px;
            }
            
            .cart-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.2);
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            }
            
            .search-results.show {
                display: block;
            }
            
            .search-result-item {
                padding: 12px 20px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background 0.3s;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .search-result-item:hover {
                background: #f5f5f5;
            }
            
            .search-result-item:last-child {
                border-bottom: none;
            }
            
            .search-result-icon {
                width: 16px;
                height: 16px;
                fill: #664AFF;
            }
        `;
        document.head.appendChild(sharedStyles);
    }

    // Agregar HTML de búsqueda y carrito al navbar si no existe
    /*
    const navbar = document.querySelector('.navbar .nav-container .nav-right');
    const isMarketplace = window.location.pathname.includes('marketplace.html');
    const isIndex = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    
    if (navbar && !document.getElementById('shared-search-cart') && !isMarketplace && !isIndex) {
        const searchCartHTML = `
            <div id="shared-search-cart" style="display: flex; align-items: center; gap: 16px;">
                <div class="search-box">
                    <input type="text" placeholder="Buscar productos..." id="shared-search-input">
                    <div class="search-icon" id="shared-search-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
                <button class="cart-button" id="shared-cart-button">
                    <svg class="cart-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <span class="cart-count" id="shared-cart-count">0</span>
                </button>
            </div>
        `;
        navbar.insertAdjacentHTML('beforeend', searchCartHTML);
    }
    */

    // Inicializar funcionalidad de búsqueda
    initializeSharedSearch();
    
    // Inicializar carrito compartido
    initializeSharedCart();
}

function initializeSharedSearch() {
    // Solo inicializar si no estamos en marketplace
    if (window.location.pathname.includes('marketplace.html')) {
        return;
    }
    
    const searchBox = document.querySelector(".search-box");
    const searchBtn = document.querySelector("#shared-search-btn");
    const searchInput = document.querySelector("#shared-search-input");
    const searchResults = document.querySelector("#search-results");
    
    // Lista de productos
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
        
        // Función para mostrar resultados
        function showSearchResults(filteredProducts) {
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
        }
        
        // Búsqueda en tiempo real
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                searchResults.classList.remove("show");
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            
            showSearchResults(filteredProducts);
        });
        
        // Cerrar búsqueda al hacer clic fuera
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
}

function initializeSharedCart() {
    // Sistema de carrito compartido
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
    
    // Botón de carrito
    const cartButton = document.getElementById('shared-cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            // If a page defines openCartModal, prefer that. Otherwise navigate to marketplace.
            if (typeof window.openCartModal === 'function') {
                try { window.openCartModal(); } catch (err) { console.warn(err); }
            } else {
                window.location.href = 'marketplace.html';
            }
        });
    }

    // Attach handlers to any cart icons/buttons present so they open the modal when available
    document.querySelectorAll('.cart-icon, .cart-button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.openCartModal === 'function') {
                try { window.openCartModal(); } catch (err) { console.warn(err); }
            } else {
                // If not available, try to navigate to marketplace (relative path)
                window.location.href = 'marketplace.html';
            }
        });
    });
    
    // Actualizar contador inicial
    updateCartCount();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', addSharedComponents);
// Funcionalidad del search box con botón X
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-icon');
    const cancelBtn = document.querySelector('.cancel-icon');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchBtn && searchInput && searchBox && cancelBtn) {
        searchBtn.onclick = () => {
            searchBox.classList.add('active');
            searchBtn.classList.add('active');
            searchInput.classList.add('active');
            cancelBtn.classList.add('active');
            searchInput.focus();
        };
        
        cancelBtn.onclick = () => {
            searchBox.classList.remove('active');
            searchBtn.classList.remove('active');
            searchInput.classList.remove('active');
            cancelBtn.classList.remove('active');
            searchInput.value = '';
        };
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                searchBox.classList.remove('active');
                searchBtn.classList.remove('active');
                searchInput.classList.remove('active');
                cancelBtn.classList.remove('active');
            }
        });
    }
});