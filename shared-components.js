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
            
            .cart-icon {
                position: relative;
                cursor: pointer;
                width: 40px;
                height: 40px;
                background: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                color: #2c3e50;
                margin-left: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .cart-icon:hover {
                background: #e3f2fd;
                color: #2196F3;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(33,150,243,0.25);
            }

            .cart-count {
                position: absolute;
                top: -2px;
                right: -2px;
                background: #f44336;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                border: 2px solid white;
                text-align: center;
                line-height: 14px;
            }

            .cart-count.show { display: flex; }
            
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

            .search-shortcuts {
                display: flex;
                gap: 8px;
                padding: 8px 4px;
                margin-top: 8px;
                flex-wrap: wrap;
            }

            .search-shortcut-item {
                background: #f5f7ff;
                color: #213547;
                padding: 6px 10px;
                border-radius: 999px;
                cursor: pointer;
                font-size: 0.9rem;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 6px rgba(102,74,255,0.08);
                border: 1px solid rgba(102,74,255,0.06);
            }

            .search-shortcut-item:hover { background: #664AFF; color: #fff; }
            .search-shortcut-item { max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            
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
    // shortcuts container (may be present in page)
    const searchShortcuts = document.querySelector('#search-shortcuts');

    // Build robust prefix to Marketplace relative paths
    const _pathParts = window.location.pathname.split('/').filter(Boolean);
    const _upPrefix = _pathParts.length > 1 ? '../'.repeat(_pathParts.length - 1) : '';

    // Lista de productos (URLs construidas desde la ubicación actual)
    const products = [
        { name: "Organizador Magnético de Cables HexaStack H1-80", url: _upPrefix + "Marketplace/productos/producto-organizador-magnetico.html" },
        { name: "Caja Táctica para Munición 9mm", url: _upPrefix + "Marketplace/productos/producto-caja-tactica.html" },
        { name: "Organizador de Cables CCTV 4 Canales", url: _upPrefix + "Marketplace/productos/producto-caja-cables-cctv.html" },
        { name: "Baluns CCTV 8 Canales", url: _upPrefix + "Marketplace/productos/producto-baluns-8-canales.html" },
        { name: "Soporte QR para Negocios", url: _upPrefix + "Marketplace/productos/producto-soporte-qr.html" }
    ];

    if (searchBtn && searchInput && searchBox && searchResults) {
        searchBtn.onclick = () => {
            searchBox.classList.add("active");
            searchBtn.classList.add("active");
            searchInput.classList.add("active");
            searchInput.focus();
            // show shortcuts when opening the search and input is empty
            if (searchShortcuts && searchInput.value.trim() === '') searchShortcuts.style.display = 'flex';
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
                if (searchShortcuts) searchShortcuts.style.display = 'flex';
                return;
            }

            if (searchShortcuts) searchShortcuts.style.display = 'none';

            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );

            showSearchResults(filteredProducts);
        });

        // Render shortcuts if container exists (hidden by default)
        if (searchShortcuts) {
            searchShortcuts.innerHTML = '';
            products.slice(0,5).forEach(p => {
                const a = document.createElement('a');
                a.href = p.url;
                a.className = 'search-shortcut-item';
                a.textContent = p.name;
                searchShortcuts.appendChild(a);
            });
            searchShortcuts.style.display = 'none';
        }

        // Hide shortcuts when clicking outside the search box
        document.addEventListener('click', function(e){
            if (searchShortcuts && searchBox && !searchBox.contains(e.target)) {
                searchShortcuts.style.display = 'none';
            }
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
    // Calcular ruta relativa robusta a marketplace.html desde cualquier subcarpeta
    const _pathParts = window.location.pathname.split('/').filter(Boolean);
    const _upPrefix = _pathParts.length > 1 ? '../'.repeat(_pathParts.length - 1) : '';
    const marketplaceHref = _upPrefix + 'Marketplace/marketplace.html';
    
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
            // If a page defines openCartModal, prefer that.
            if (typeof window.openCartModal === 'function') {
                try { window.openCartModal(); } catch (err) { console.warn(err); }
                return;
            }

            // If the page has a cart modal element, show it (handles index which uses direct jQuery modal)
            const pageModal = document.getElementById('cartModal');
            if (pageModal) {
                try {
                    if (window.$) $('#cartModal').show();
                    else pageModal.style.display = 'block';
                } catch (err) { console.warn(err); }
                return;
            }

            // Fallback: navigate to marketplace
            window.location.href = marketplaceHref;
        });
    }

    // Attach handlers to any cart icons/buttons present so they open the modal when available
    document.querySelectorAll('.cart-icon, .cart-button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.openCartModal === 'function') {
                try { window.openCartModal(); } catch (err) { console.warn(err); }
                return;
            }

            const pageModal = document.getElementById('cartModal');
            if (pageModal) {
                try {
                    if (window.$) $('#cartModal').show();
                    else pageModal.style.display = 'block';
                } catch (err) { console.warn(err); }
                return;
            }

            // If not available, try to navigate to marketplace (relative path)
            window.location.href = marketplaceHref;
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

// Protección global contra invocaciones accidentales de checkout()
(function(){
    // Registro de interacción del usuario (click/tecla)
    // Track page load time and last user interaction
    window.__pageLoadedAt = Date.now();
    window.__lastUserInteraction = Date.now();
    // Listen to early pointer/mouse/touch events so inline onclick handlers see recent interaction
    ['pointerdown','mousedown','click','keydown','touchstart'].forEach(evt => {
        document.addEventListener(evt, function(){ window.__lastUserInteraction = Date.now(); }, { passive: true });
    });

    // Manejador que envuelve la implementación real de checkout
    function makeSafeCheckout(original) {
        return function safeCheckout(){
            const now = Date.now();
            const timeSinceLoad = now - (window.__pageLoadedAt || 0);
            const timeSinceUser = now - (window.__lastUserInteraction || 0);

            // Block only if call happens very early after load (first 3s)
            // AND there was no recent user interaction (2s). This prevents
            // accidental automatic openings on page load while allowing
            // normal user clicks.
            if (timeSinceLoad < 3000 && timeSinceUser > 2000) {
                console.warn('checkout() bloqueado: llamada temprana sin interacción');
                return;
            }

            return original.apply(this, arguments);
        };
    }

    // Si ya existe, envolverla; si se define después, intentar envolverla más tarde
    if (typeof window.checkout === 'function') {
        window.checkout = makeSafeCheckout(window.checkout);
    } else {
        // Vigilar asignaciones a window.checkout (si la página las define después)
        Object.defineProperty(window, 'checkout', {
            configurable: true,
            set(fn) {
                if (typeof fn === 'function') {
                    const wrapped = makeSafeCheckout(fn);
                    // Reassign the wrapped function and stop intercepting
                    Object.defineProperty(window, 'checkout', { value: wrapped, writable: true, configurable: true });
                } else {
                    Object.defineProperty(window, 'checkout', { value: fn, writable: true, configurable: true });
                }
            },
            get() { return undefined; }
        });
    }
})();