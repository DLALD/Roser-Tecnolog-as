document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-icon');
    const cancelIcon = document.querySelector('.cancel-icon');

    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            searchBox.classList.add('active');
            searchInput.classList.add('active');
            searchIcon.classList.add('active');
            cancelIcon.classList.add('active');
            searchInput.focus();
        });
    }

    if (cancelIcon) {
        cancelIcon.addEventListener('click', function() {
            searchBox.classList.remove('active');
            searchInput.classList.remove('active');
            searchIcon.classList.remove('active');
            cancelIcon.classList.remove('active');
            searchInput.value = '';
            showSearchResults([], {});
        });
        // Funcionalidad de búsqueda con redirección - Updated v2
 const products = getProductRoutes('../../');
    }
    

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
            searchInput.classList.remove('active');
            searchIcon.classList.remove('active');
            cancelIcon.classList.remove('active');
            searchInput.value = '';
            showSearchResults([], {});
        }
    });

    // Menu dropdown functionality
    const menuButton = document.querySelector('.menu-button');
    const sidebarDropdown = document.querySelector('.sidebar-dropdown');

    if (menuButton) {
        menuButton.addEventListener('click', function() {
            sidebarDropdown.classList.toggle('active');
        });
    }

    // Section headers toggle
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const subsection = this.nextElementSibling;
            const arrow = this.querySelector('.section-arrow');
            
            subsection.classList.toggle('active');
            if (arrow) {
                arrow.style.transform = subsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });

    // Apps and prototypes headers
    const appsHeader = document.querySelector('.apps-header');
    const prototypesHeader = document.querySelector('.prototypes-header');

    if (appsHeader) {
        appsHeader.addEventListener('click', function() {
            const subSubsection = document.querySelector('.sub-subsection');
            const arrow = this.querySelector('.section-arrow');
            
            subSubsection.classList.toggle('active');
            if (arrow) {
                arrow.style.transform = subSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    if (prototypesHeader) {
        prototypesHeader.addEventListener('click', function() {
            const prototypeSubsection = document.querySelector('.prototype-subsection');
            const arrow = this.querySelector('.section-arrow');
            
            prototypeSubsection.classList.toggle('active');
            if (arrow) {
                arrow.style.transform = prototypeSubsection.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!document.querySelector('.nav-container').contains(e.target) && !sidebarDropdown.contains(e.target)) {
            sidebarDropdown.classList.remove('active');
        }
    });

    // Search with products
    const products = getProductRoutes('../../');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                const results = Object.keys(products).filter(product => 
                    product.includes(query)
                );
                showSearchResults(results, products);
            } else {
                showSearchResults([], products);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase();
                const exactMatch = Object.keys(products).find(product => 
                    product.includes(query)
                );
                if (exactMatch) {
                    window.location.href = products[exactMatch];
                }
            }
        });
    }

    // Initialize cart
    updateCartCount();
    updateCartDisplay();
    
    // Cart icon click event
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCartModal);
    }
});

function showSearchResults(results, products) {
    const searchBox = document.querySelector('.search-box');
    let dropdown = document.querySelector('.search-dropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '50px';
        dropdown.style.left = '0';
        dropdown.style.width = '100%';
        dropdown.style.background = 'white';
        dropdown.style.border = '1px solid #e0e0e0';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        dropdown.style.maxHeight = '300px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.zIndex = '9999';
        dropdown.style.padding = '8px 0';
        searchBox.appendChild(dropdown);
    }
    
    if (results.length > 0) {
        dropdown.innerHTML = results.map(result => `
            <div style="padding: 12px 16px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 12px;" 
                onmouseover="this.style.background='#f8f9fa'" 
                onmouseout="this.style.background='white'"
                onclick="selectSearchResult('${result}', '${products[result]}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#664AFF">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span style="color: #333; font-size: 14px; text-transform: capitalize; flex: 1;">${result}</span>
            </div>
        `).join('');
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function selectSearchResult(result, url) {
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-icon');
    const cancelIcon = document.querySelector('.cancel-icon');
    
    showSearchResults([], {});
    searchBox.classList.remove('active');
    searchIcon.classList.remove('active');
    searchInput.classList.remove('active');
    cancelIcon.classList.remove('active');
    searchInput.value = '';
    window.location.href = url;
}

// Cart system
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedPaymentMethod = localStorage.getItem('selectedPayment') || '';
const paymentMethodLogos = {
    'Nequi': '../../Marketplace/metodos de pago/Nequi.png',
    'Daviplata': '../../Marketplace/metodos de pago/Daviplata.png',
    'Bancolombia': '../../Marketplace/metodos de pago/Bancolombia.png',
    'Efecty': '../../Marketplace/metodos de pago/Efecty.png',
    'Visa': '../../Marketplace/metodos de pago/Visa.png',
    'Mastercard': '../../Marketplace/metodos de pago/Mastercard.png',
    'PSE': '../../Marketplace/metodos de pago/PSE.png'
};

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        if (count > 0) {
            cartCountElement.classList.add('show');
        } else {
            cartCountElement.classList.remove('show');
        }
    }
}

function updateCartDisplay() {
    const cartBody = document.getElementById('cartBody');
    if (!cartBody) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        document.getElementById('cart-total').textContent = '$0 COP';
        return;
    }
    
    let html = '<div class="cart-items">';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        let imagePath = item.image || '';
        if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
            let cleanPath = imagePath.replace(/^(\.\.\/)+/, '');
            imagePath = '../../' + cleanPath;
        }
        
        html += `
            <div class="cart-item">
                <img src="${imagePath}" alt="${item.name}" class="cart-item-img">
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
    cartBody.innerHTML = html;
    document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CO')} COP`;
    
    // Update payment display
    const cartPaymentMethod = document.getElementById('cartPaymentMethod');
    if (cartPaymentMethod) {
        if(selectedPaymentMethod) {
            const logoSrc = paymentMethodLogos[selectedPaymentMethod];
            let paymentHtml = '<div style="display: flex; align-items: center; gap: 8px;">';
            if (logoSrc) {
                paymentHtml += `<img src="${logoSrc}" alt="${selectedPaymentMethod}" style="height: 24px; object-fit: contain;">`;
            }
            paymentHtml += `<span style="font-weight: bold; color: #333;">${selectedPaymentMethod}</span>`;
            paymentHtml += `<button class="remove-payment-btn" onclick="removePaymentMethod()" title="Quitar método de pago" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 1.5rem; padding: 0 0 0 5px; line-height: 1; font-weight: bold;">&times;</button>`;
            paymentHtml += '</div>';
            cartPaymentMethod.innerHTML = paymentHtml;
        } else {
            cartPaymentMethod.innerHTML = '<span style="color: #f57c00; cursor: pointer;" onclick="closeCartModal(); openPaymentModal();">No seleccionado (Clic para elegir)</span>';
        }
    }
}

window.addToCart = function(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
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
    document.getElementById('cartModal').style.display = 'block';
    updateCartDisplay();
};

window.closeCartModal = function() {
    document.getElementById('cartModal').style.display = 'none';
};

window.openPaymentModal = function() {
    document.getElementById('paymentModal').style.display = 'block';
};

window.closePaymentModal = function() {
    document.getElementById('paymentModal').style.display = 'none';
};

window.selectPayment = function(method, element) {
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedPaymentMethod = method;
};

window.confirmPaymentSelection = function() {
    if (selectedPaymentMethod) {
        localStorage.setItem('selectedPayment', selectedPaymentMethod);
        updateCartDisplay();
        closePaymentModal();
        if (window.showToast) {
            window.playSuccessSound();
            window.showToast('¡Método Confirmado!', 'Pago actualizado a: ' + selectedPaymentMethod);
        } else {
            alert('Método de pago actualizado: ' + selectedPaymentMethod);
        }
    }
};

window.removePaymentMethod = function() {
    selectedPaymentMethod = '';
    localStorage.removeItem('selectedPayment');
    updateCartDisplay();
};

window.checkout = function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert('Por favor selecciona un método de pago');
        openPaymentModal();
        return;
    }
    
    let message = '¡Hola! Me gustaría realizar el siguiente pedido:\n\n';
    cart.forEach(item => {
        message += `• ${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: $${total.toLocaleString('es-CO')} COP*\n`;
    message += `*Método de pago: ${selectedPaymentMethod}*`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573113579437&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const paymentModal = document.getElementById('paymentModal');
    
    if (event.target === cartModal) {
        closeCartModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
};
