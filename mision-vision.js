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