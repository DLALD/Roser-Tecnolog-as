document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-bar');
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
        });
    }

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
            searchInput.classList.remove('active');
            searchIcon.classList.remove('active');
            cancelIcon.classList.remove('active');
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
        if (!document.querySelector('.nav-container').contains(e.target)) {
            sidebarDropdown.classList.remove('active');
        }
    });
});