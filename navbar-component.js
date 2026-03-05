// navbar-component.js - Componente de Navbar Global
const NavbarComponent = {
    init(config = {}) {
        const defaults = {
            logoPath: '../Imagenes/Rosero.png',
            homeUrl: 'index.html',
            marketplaceUrl: '../Marketplace/Pagina Marketplace/marketplace.html',
            marketplaceIcon: '../Marketplace/Iconos/Marketplace.png',
            cartIcon: '../Imagenes/Carrito.png'
        };
        
        const settings = { ...defaults, ...config };
        
        if (!document.querySelector('.navbar')) {
            const firstSection = document.querySelector('section, main, .hero');
            if (firstSection) {
                firstSection.insertAdjacentHTML('beforebegin', this.getHTML(settings));
            } else {
                document.body.insertAdjacentHTML('afterbegin', this.getHTML(settings));
            }
            // Disparar evento cuando el navbar esté listo
            setTimeout(() => {
                document.dispatchEvent(new Event('navbarReady'));
            }, 50);
        }
    },

    getHTML(settings) {
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <div class="menu-button">
                        <span class="menu-lines">☰</span>
                    </div>
                    <div class="nav-logo">
                        <a href="${settings.homeUrl}" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
                            <img src="${settings.logoPath}" alt="Roser Tecnologías" class="logo-img">
                            <h2>Roser Tecnologías</h2>
                        </a>
                        <a href="${settings.marketplaceUrl}" class="marketplace-link" style="display: flex; align-items: center; gap: 6px; text-decoration: none; margin-left: 20px; padding: 8px 12px; background: #e3f2fd; border-radius: 6px; transition: all 0.3s ease;">
                            <img src="${settings.marketplaceIcon}" alt="Marketplace" style="width: 20px; height: 20px;">
                            <span style="color: #1976d2; font-weight: 500; font-size: 0.9rem;">Marketplace</span>
                        </a>
                    </div>
                    <ul class="nav-menu"></ul>
                    <div class="nav-right">
                        <div class="search-box">
                            <input type="text" placeholder="Buscar productos...">
                            <div class="search-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </div>
                            <div class="cancel-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="cart-icon" onclick="event.preventDefault(); event.stopPropagation(); openCartModal();" style="position: relative; cursor: pointer; display: flex; align-items: center; margin-left: 15px; min-width: 40px; min-height: 40px; justify-content: center;">
                        <img src="${settings.cartIcon}" alt="Carrito" width="24" height="24">
                        <span class="cart-count" id="cart-count" style="position: absolute; top: 2px; right: 2px; background: #ff4444; color: white; border-radius: 50%; width: 16px; height: 16px; display: none; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">0</span>
                    </div>
                    <div class="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <!-- Dropdown Menu -->
                <div class="sidebar-dropdown">
                    <div class="dropdown-section">
                        <div class="section-header">
                            <img src="../Imagenes/Servicios.png" alt="Servicios" class="section-icon">
                            <span class="section-title">Servicios</span>
                            <span class="section-arrow">▼</span>
                        </div>
                        <div class="subsection">
                            <a href="../Servicios/Diseños-3D/disenos-3.html">
                                <img src="../Imagenes/d3d.png" alt="Diseños 3D" class="subsection-icon">
                                Diseños 3D
                            </a>
                            <a href="../Servicios/Impresiones-3D/impresiones-3d.html">
                                <img src="../Imagenes/i3d.png" alt="Impresión 3D" class="subsection-icon">
                                Impresión 3D
                            </a>
                            <a href="../Servicios/Diseño Electrico/diseno-electrico.html">
                                <img src="../Imagenes/D_electrico.png" alt="Diseño Eléctrico" class="subsection-icon">
                                Diseño Eléctrico
                            </a>
                            <a href="../Servicios/Diseño mecanico/diseno-mecanico.html">
                                <img src="../Imagenes/D_mecanico.png" alt="Diseño Mecánico" class="subsection-icon">
                                Diseño Mecánico
                            </a>
                            <a href="../Servicios/Fabricacion de sistemas mecanicos/fabricacion-sistemas-mecanicos.html">
                                <img src="../Imagenes/F_mecanico.png" alt="Fabricación de Sistemas Mecánicos" class="subsection-icon">
                                Fabricación de Sistemas Mecánicos
                            </a>
                        </div>
                    </div>
                    <div class="dropdown-section">
                        <div class="section-header">
                            <img src="../Imagenes/PTS.png" alt="Productos" class="section-icon">
                            <span class="section-title">Productos</span>
                            <span class="section-arrow">▼</span>
                        </div>
                        <div class="subsection">
                            <div class="prototypes-header">
                                <img src="../Imagenes/Proto.png" alt="Prototipos" class="subsection-icon">
                                Prototipos
                                <span class="section-arrow">▼</span>
                            </div>
                            <div class="prototype-subsection">
                                <a href="../Productos-Roser/Prototipos/DePie/DePie.html">
                                    <img src="../Imagenes/ceo.png" alt="DePie" class="subsection-icon">
                                    DePie
                                </a>
                            </div>
                            <div class="apps-header" data-toggle="apps">
                                <img src="../Imagenes/apps.png" alt="Apps" class="subsection-icon">
                                Apps
                                <span class="section-arrow">▼</span>
                            </div>
                            <div class="sub-subsection">
                                <a href="../Productos-Roser/Apps/3dcost/3dcost.html">
                                    <img src="../Imagenes/3D.png" alt="3D" class="subsection-icon">
                                    3DCost
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-section">
                        <div class="section-header">
                            <img src="../Imagenes/empresa.png" alt="Empresa" class="section-icon">
                            <span class="section-title">Empresa</span>
                            <span class="section-arrow">▼</span>
                        </div>
                        <div class="subsection">
                            <a href="../Empresa/Conocenos/conocenos.html">
                                <img src="../Imagenes/ceo.png" alt="CEO" class="subsection-icon">
                                Conocenos
                            </a>
                            <a href="../Empresa/Mision y Vision/mision-vision.html">
                                <img src="../Imagenes/vision.png" alt="Vision" class="subsection-icon">
                                Misión y Visión
                            </a>
                            <a href="../Empresa/Terminos y Condiciones/terminos-condiciones.html">
                                <img src="../Imagenes/terminos.png" alt="Terminos" class="subsection-icon">
                                Términos y Condiciones
                            </a>
                            <a href="../Empresa/Politicas y Privacidad/politica-privacidad.html">
                                <img src="../Imagenes/privacidad.png" alt="Privacidad" class="subsection-icon">
                                Privacidad
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NavbarComponent.init());
} else {
    NavbarComponent.init();
}
