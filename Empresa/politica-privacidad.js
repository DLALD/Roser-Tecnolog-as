// Cart modal + cart behavior for política de privacidad page
document.addEventListener('DOMContentLoaded', function(){
    // Inject cart modal markup if not present
    if (!document.getElementById('cartModal')) {
        const modalHTML = `
        <div id="cartModal" class="modal">
            <div class="modal-content cart-modal-content">
                <span class="close" onclick="closeCartModal()">&times;</span>
                <div class="cart-header">
                    <h2>Carrito de Compras</h2>
                </div>
                <div id="cartBody" class="cart-body">
                    <p class="empty-cart">Tu carrito está vacío</p>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cart-total">$0 COP</span>
                    </div>
                    <button class="checkout-btn" onclick="checkout()">Finalizar Compra por WhatsApp</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Ensure close button receives clicks: add direct capture listener and style safety
    (function ensureCloseWorks(){
        const modal = document.getElementById('cartModal');
        if (!modal) return;
        const closeEl = modal.querySelector('.close');
        const modalContent = modal.querySelector('.modal-content');
        try {
            if (modalContent) {
                modalContent.style.zIndex = '2001';
                modalContent.style.pointerEvents = 'auto';
            }
            // If the close button is missing (in some load orders it was not injected), create it
            if (!closeEl && modalContent) {
                const span = document.createElement('span');
                span.className = 'close';
                span.innerHTML = '&times;';
                span.style.cursor = 'pointer';
                span.style.position = 'absolute';
                span.style.right = '20px';
                span.style.top = '15px';
                span.style.zIndex = '2002';
                span.addEventListener('click', function(e){ e.stopPropagation(); e.preventDefault(); try { window.closeCartModal(); } catch(err){ console.error(err); } });
                // insert as first child so it visually matches marketplace
                modalContent.insertBefore(span, modalContent.firstChild);
                console.debug('[DEBUG] injected missing close button');
            } else if (closeEl) {
                closeEl.style.pointerEvents = 'auto';
                closeEl.style.zIndex = '2002';
                // ensure a safe listener exists
                closeEl.addEventListener('click', function onCloseClick(e){
                    e.stopPropagation();
                    e.preventDefault();
                    console.debug('[DEBUG] closeEl clicked (capture listener)');
                    try { window.closeCartModal(); } catch(err){ console.error('closeCartModal call failed', err); }
                }, { capture: true, passive: false });
            }
        } catch(err){ console.error('ensureCloseWorks error', err); }
    })();

    // Basic menu toggles reused from other Empresa pages
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuButton = document.querySelector('.menu-button');
    const sidebarDropdown = document.querySelector('.sidebar-dropdown');

    if (hamburger && navMenu) hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });
    if (menuButton && sidebarDropdown) menuButton.addEventListener('click', (e) => { e.stopPropagation(); sidebarDropdown.classList.toggle('active'); });

    // Cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); window.dispatchEvent(new Event('storage')); }

    function updateCartCount() {
        const count = cart.reduce((s,i)=>s+i.quantity,0);
        const el = document.getElementById('shared-cart-count');
        if (el) { el.textContent = count; if (count>0) el.classList.add('show'); else el.classList.remove('show'); }
    }

    function updateCartDisplay(){
        const cartBodyEl = document.getElementById('cartBody');
        if (!cartBodyEl) return;
        if (cart.length===0){ cartBodyEl.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>'; document.getElementById('cart-total').textContent = '$0 COP'; return; }
        let html = '<div class="cart-items">';
        let total = 0;
        cart.forEach((item, idx) => {
            const itemTotal = item.price * item.quantity; total += itemTotal;
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toLocaleString('es-CO')} COP</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button data-action="dec" data-idx="${idx}">-</button>
                        <span>${item.quantity}</span>
                        <button data-action="inc" data-idx="${idx}">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toLocaleString('es-CO')} COP</div>
                    <button class="remove-item" data-remove="${idx}">&times;</button>
                </div>
            `;
        });
        html += '</div>';
        cartBodyEl.innerHTML = html;
        document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CO')} COP`;
    }

    window.addToCart = function(id, name, price, image){
        const existing = cart.find(i=>i.id===id);
        if (existing) existing.quantity++; else cart.push({id,name,price,image,quantity:1});
        saveCart(); updateCartCount(); updateCartDisplay(); alert('Producto agregado al carrito');
    }

    window.removeFromCart = function(index){ cart.splice(index,1); saveCart(); updateCartCount(); updateCartDisplay(); }
    window.increaseQuantity = function(index){ cart[index].quantity++; saveCart(); updateCartCount(); updateCartDisplay(); }
    window.decreaseQuantity = function(index){ if (cart[index].quantity>1){ cart[index].quantity--; saveCart(); updateCartCount(); updateCartDisplay(); } }

    // Use same open/close behavior as marketplace/terminos
    window.openCartModal = function() {
        updateCartDisplay();
        if (window.$) $('#cartModal').show();
        else {
            const m = document.getElementById('cartModal'); if (m) m.style.display = 'block';
        }
    }

    window.closeCartModal = function() {
        if (window.$) $('#cartModal').hide();
        else {
            const m = document.getElementById('cartModal'); if (m) m.style.display = 'none';
        }
    }

    // Marketplace markup uses inline onclick for close and checkout; keep additional safety listeners

    // Checkout behaviour (same as marketplace) — opens WhatsApp with order
    window.checkout = function(){
        if (cart.length===0){ alert('Tu carrito está vacío'); return; }
        const phone = '573113579437';
        let message = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
        let total = 0;
        cart.forEach(item=>{ const itemTotal = item.price * item.quantity; total += itemTotal; message += `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${itemTotal.toLocaleString('es-CO')} COP\n\n`; });
        message += `Total: $${total.toLocaleString('es-CO')} COP`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // If a checkout button id exists, wire it (backwards compat)
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', function(){ window.checkout(); });

    // Delegate clicks inside cart for inc/dec/remove
    document.body.addEventListener('click', function(e){
        const dec = e.target.closest('button[data-action="dec"]');
        const inc = e.target.closest('button[data-action="inc"]');
        const rem = e.target.closest('button[data-remove]');
        if (dec){ const idx = Number(dec.dataset.idx); window.decreaseQuantity(idx); }
        if (inc){ const idx = Number(inc.dataset.idx); window.increaseQuantity(idx); }
        if (rem){ const idx = Number(rem.dataset.remove); window.removeFromCart(idx); }
    });

    // Close modal when clicking outside content or pressing ESC (same as terminos)
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

    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { console.debug('[DEBUG] Escape pressed'); window.closeCartModal(); } });

    // Sync cart changes from other tabs
    window.addEventListener('storage', function(e){ if (e.key==='cart'){ cart = JSON.parse(e.newValue)||[]; updateCartCount(); updateCartDisplay(); } });

    // initial render
    updateCartCount();
});
