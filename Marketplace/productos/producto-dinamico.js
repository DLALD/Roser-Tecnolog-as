const SUPABASE_URL = 'https://usazecwhbsxrtyijchpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYXplY3doYnN4cnR5aWpjaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTQzMzEsImV4cCI6MjA4OTE3MDMzMX0.TLqiJQDCjNAZAWrCn_TNaieq2khaf7ecnic4alNM4mo';

let currentProduct = null;

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return showError();

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`,
            { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const [product] = await res.json();
        if (!product) return showError();

        currentProduct = product;
        renderProduct(product);
        loadRelated(product);
    } catch {
        showError();
    }
}

function renderProduct(p) {
    document.title = `${p.name} - Roser Tecnologías`;

    // Textos
    document.getElementById('productName').textContent = p.name;
    document.getElementById('productPrice').textContent = `$${Number(p.price).toLocaleString('es-CO')} COP`;
    document.getElementById('productDescription').textContent = p.description || '';
    document.getElementById('productPrep').textContent = `${p.preparation_days} días hábiles`;
    document.getElementById('productRating').textContent = `(${p.rating_count || 0} valoraciones)`;

    // Estrellas
    const stars = Math.round(p.rating || 5);
    document.getElementById('productStars').textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);

    // Galería o colores
    const colors = p.colors || [];
    if (colors.length) {
        renderColorSelector(colors);
        renderGallery(colors[0].images || [p.image]);
    } else {
        const allImages = [p.image, ...(p.gallery_images || [])].filter(Boolean);
        renderGallery(allImages);
    }

    // Features (Acerca de este producto)
    const features = p.features || [];
    const descEl = document.getElementById('productDescription');
    if (features.length) {
        descEl.outerHTML = `<ul id="productDescription" class="product-features">${
            features.map(f => `<li>${f}</li>`).join('')
        }</ul>`;
    } else {
        descEl.textContent = p.description || '';
    }

    // Specs
    const specs = p.specs || {};
    if (Object.keys(specs).length) {
        document.getElementById('specsTable').innerHTML = Object.entries(specs).map(([k, v]) => `
            <tr><td><strong>${k}:</strong></td><td>${v}</td></tr>
        `).join('');
        document.getElementById('productSpecs').style.display = '';
    }

    // WhatsApp
    $('#BotonWA').floatingWhatsApp({
        phone: '573113579437',
        headerTitle: 'Roser Tecnologías',
        popupMessage: p.whatsapp_message || `¡Hola! ¿En qué podemos ayudarte?`,
        showPopup: true,
        position: 'right',
        size: '60px',
        backgroundColor: '#25D366',
        zIndex: 9999
    });

    // Mostrar página
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('productPage').classList.remove('hidden');

    initImageZoom();
}

async function loadRelated(p) {
    const cats = (p.categories || []);
    if (!cats.length) return;

    const catsParam = `{${cats.join(',')}}`;
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=neq.${p.id}&stock=eq.true&categories=ov.${encodeURIComponent(catsParam)}&select=id,name,price,image,categories`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const all = await res.json();
    const grid = document.getElementById('relatedGrid');
    if (!all.length) { grid.closest('.related-products').style.display = 'none'; return; }

    // Ordenar por cantidad de categorías en común (más relevante primero)
    const scored = all.map(r => ({
        ...r,
        score: (r.categories || []).filter(c => cats.includes(c)).length
    })).sort((a, b) => b.score - a.score);

    grid.innerHTML = scored.map(r => `
        <div class="related-item" onclick="window.location.href='producto-dinamico.html?id=${r.id}'">
            <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.style.display='none'">
            <h3>${r.name}</h3>
            <p class="price">$${Number(r.price).toLocaleString('es-CO')} COP</p>
        </div>
    `).join('');
}

function renderGallery(images) {
    const allImages = images.filter(Boolean);
    if (!allImages.length) return;
    const mainImg = document.getElementById('mainImage');
    mainImg.src = allImages[0];
    mainImg.alt = currentProduct?.name || '';

    // Preload imagen principal
    const preload = new Image();
    preload.src = allImages[0];

    const MAX = 6;
    const thumbGallery = document.getElementById('thumbnailGallery');
    thumbGallery.innerHTML = allImages.slice(0, MAX).map((src, i) => `
        <img src="${src}" class="thumbnail ${i === 0 ? 'active' : ''}" loading="lazy" onclick="changeMainImage(this)" alt="">
    `).join('');

    if (allImages.length > MAX) {
        thumbGallery.insertAdjacentHTML('beforeend',
            `<div class="thumbnail-more" onclick="openGalleryModal()">+${allImages.length - MAX}</div>`);
    }
    currentGalleryImages = allImages;
}

let currentGalleryImages = [];

function renderColorSelector(colors) {
    const actionsDiv = document.querySelector('.product-actions');
    const existing = document.getElementById('colorSelector');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'colorSelector';
    div.className = 'color-selector';
    div.innerHTML = `
        <label>Color: <strong id="selectedColorName">${colors[0].name}</strong></label>
        <div class="color-options">
            ${colors.map((c, i) => `
                <button class="color-circle ${i === 0 ? 'active' : ''}" 
                    style="background:${c.hex}" 
                    title="${c.name}"
                    onclick="selectColor(this, ${i})">
                </button>
            `).join('')}
        </div>
    `;
    actionsDiv.insertBefore(div, actionsDiv.firstChild);

    window._productColors = colors;
    window._selectedColorIdx = 0;
}

window._selectedColorIdx = 0;

window.selectColor = function(btn, idx) {
    document.querySelectorAll('.color-circle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window._selectedColorIdx = idx;
    const color = window._productColors[idx];
    const nameEl = document.getElementById('selectedColorName');
    if (nameEl) nameEl.textContent = color.name;
    renderGallery(color.images || []);
};

window.openGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    const body = document.getElementById('galleryModalBody');
    body.innerHTML = currentGalleryImages.map(src => `
        <img src="${src}" class="gallery-modal-img" onclick="changeMainImage(this); closeGalleryModal()">
    `).join('');
    modal.style.display = 'flex';
};

window.closeGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    if (modal) modal.style.display = 'none';
};

function showError() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
}

// ── Zoom estilo Amazon ─────────────────────────────────────
function initImageZoom() {
    const container = document.getElementById('mainImageContainer');
    const lens      = document.getElementById('zoomLens');
    const result    = document.getElementById('zoomResult');
    const zoomImg   = document.getElementById('zoomImage');
    const mainImg   = document.getElementById('mainImage');
    if (!container) return;

    const LENS_SIZE = 150;
    const ZOOM      = 2.5;

    // Calcula el rect real de la imagen dentro del contenedor (object-fit: contain)
    function getImageBounds() {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const natW = mainImg.naturalWidth  || cw;
        const natH = mainImg.naturalHeight || ch;
        const scale = Math.min(cw / natW, ch / natH);
        const rendW = natW * scale;
        const rendH = natH * scale;
        return {
            left:   (cw - rendW) / 2,
            top:    (ch - rendH) / 2,
            width:  rendW,
            height: rendH
        };
    }

    container.addEventListener('mousemove', e => {
        const cr = container.getBoundingClientRect();
        const ib = getImageBounds();
        const x  = e.clientX - cr.left;
        const y  = e.clientY - cr.top;

        // Solo activar si el cursor está sobre la imagen real
        if (x < ib.left || x > ib.left + ib.width ||
            y < ib.top  || y > ib.top  + ib.height) {
            lens.style.display   = 'none';
            result.style.display = 'none';
            return;
        }

        // Lens limitado a los bordes de la imagen
        const lx = Math.min(Math.max(x - LENS_SIZE / 2, ib.left), ib.left + ib.width  - LENS_SIZE);
        const ly = Math.min(Math.max(y - LENS_SIZE / 2, ib.top),  ib.top  + ib.height - LENS_SIZE);
        lens.style.left    = lx + 'px';
        lens.style.top     = ly + 'px';
        lens.style.width   = LENS_SIZE + 'px';
        lens.style.height  = LENS_SIZE + 'px';
        lens.style.display = 'block';

        // Imagen del zoom sincronizada con la posición del cursor
        zoomImg.src = mainImg.src;
        const ratioX = (x - ib.left) / ib.width;
        const ratioY = (y - ib.top)  / ib.height;
        const zw = ib.width  * ZOOM;
        const zh = ib.height * ZOOM;
        zoomImg.style.width  = zw + 'px';
        zoomImg.style.height = zh + 'px';
        zoomImg.style.left   = -(ratioX * zw - result.offsetWidth  / 2) + 'px';
        zoomImg.style.top    = -(ratioY * zh - result.offsetHeight / 2) + 'px';

        result.style.display = 'block';
    });

    container.addEventListener('mouseleave', () => {
        lens.style.display   = 'none';
        result.style.display = 'none';
    });
}

window.changeMainImage = function(thumb) {
    const mainImg = document.getElementById('mainImage');
    mainImg.classList.add('img-loading');
    mainImg.onload = () => mainImg.classList.remove('img-loading');
    mainImg.src = thumb.src;
    document.getElementById('zoomImage').src = thumb.src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

window.addToCartProduct = function() {
    if (!currentProduct) return;
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    const colors = window._productColors;
    const selectedColor = colors?.length ? colors[window._selectedColorIdx || 0] : null;
    const cartImage = selectedColor?.images?.[0] || currentProduct.image;
    const cartName = selectedColor ? `${currentProduct.name} - ${selectedColor.name}` : currentProduct.name;
    const cartId = selectedColor ? `${currentProduct.id}-${selectedColor.name}` : currentProduct.id;

    const existing = cart.find(i => i.id === cartId);
    if (existing) existing.quantity += qty;
    else cart.push({ id: cartId, name: cartName, price: currentProduct.price, image: cartImage, quantity: qty });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();

    // Sonido
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);

    // Toast
    let toast = document.getElementById('cartToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cartToast';
        toast.className = 'cart-toast';
        toast.innerHTML = '<span class="toast-icon">✅</span><span>Agregado al carrito</span>';
        document.body.appendChild(toast);
    }
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);

    // Botón
    const btn = document.querySelector('.add-to-cart-btn');
    btn.textContent = '¡Agregado!';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Agregar al Carrito'; btn.classList.remove('added'); }, 2000);
};

window.contactWhatsApp = function() {
    const msg = currentProduct?.whatsapp_message || `¡Hola! Estoy interesado en: ${currentProduct?.name}`;
    window.open(`https://wa.me/573113579437?text=${encodeURIComponent(msg)}`, '_blank');
};

$(document).ready(loadProduct);
