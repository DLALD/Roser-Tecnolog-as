// Rutas centralizadas de productos para búsqueda
const PRODUCT_ROUTES = {
    'organizador magnético': 'Marketplace/productos/Organizador Magnético De Cables/producto-organizador-magnetico.html',
    'hexastack': 'Marketplace/productos/Organizador Magnético De Cables/producto-organizador-magnetico.html',
    'caja táctica': 'Marketplace/productos/Caja Táctica Para Munición 9mm/producto-caja-tactica.html',
    'munición': 'Marketplace/productos/Caja Táctica Para Munición 9mm/producto-caja-tactica.html',
    'cables cctv': 'Marketplace/productos/Caja Para Cables CCTV Cámaras De Seguridad/producto-caja-cables-cctv.html',
    'organizador cables cctv': 'Marketplace/productos/Caja Para Cables CCTV Cámaras De Seguridad/producto-caja-cables-cctv.html',
    'baluns': 'Marketplace/productos/Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales/producto-baluns-8-canales.html',
    'Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales': 'Marketplace/productos/Baluns Y Borneras Caja Para Cables Cctv Cámaras 8 Canales/producto-baluns-8-canales.html',
    'soporte qr': 'Marketplace/productos/Soporte QR/producto-soporte-qr.html',
    'soporte para negocios QR': 'Marketplace/productos/Soporte QR/producto-soporte-qr.html'
};

// Función para obtener rutas con prefijo relativo
function getProductRoutes(prefix = '') {
    const routes = {};
    for (const [key, value] of Object.entries(PRODUCT_ROUTES)) {
        routes[key] = prefix + value;
    }
    return routes;
}
