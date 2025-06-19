document.addEventListener('DOMContentLoaded', function() {
            // --- GESTION DES TRANSITIONS DE PAGE : FADE & MOVE (Version finale) ---
    const body = document.body;

    // ANIMATION D'ENTRÉE : faire apparaître la page
    window.addEventListener('load', () => {
        // On initialise la position de départ de l'animation d'entrée
        body.style.transform = 'translateY(-15px)';

        // On ajoute la classe qui va déclencher la transition pour rendre la page visible
        setTimeout(() => {
            body.classList.add('is-visible');
        }, 50); // Petit délai pour s'assurer que tout est prêt
    });

    // ANIMATION DE SORTIE : faire disparaître la page
    const allLinks = document.querySelectorAll('a');

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const isLocalLink = href && (href.startsWith('../html/') || href.endsWith('.html'));
            const isTargetBlank = this.getAttribute('target') === '_blank';
            const isHashLink = href && href.startsWith('#');
            const isDownloadLink = this.hasAttribute('download');

            if (isLocalLink && !isTargetBlank && !isHashLink && !isDownloadLink) {
                e.preventDefault();
                
                // On ajoute la classe qui déclenche l'animation de sortie
                body.classList.add('is-leaving');

                // On attend la fin de l'animation de sortie avant de changer de page
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Doit correspondre à la durée de la transition CSS (0.5s)
            }
        });
    });

    // --- Gestion du menu Hamburger pour mobile ---
    const toggler = document.querySelector('.navbar-toggler');
    const menu = document.querySelector('.navbar .menu');

    if (toggler && menu) {
        toggler.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // --- Gestion du filtre du Portfolio ---
    const filterContainer = document.querySelector('.conteneur-btn');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.bouton');
        const projectItems = document.querySelectorAll('.projet-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                projectItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Fermeture des popups ---
    const closeButtons = document.querySelectorAll('.overlay .close');
    if(closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '#!';
            });
        });

        const overlays = document.querySelectorAll('.overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    window.location.hash = '#!';
                }
            });
        });
    }

    // --- 5. GESTION DU MODE SOMBRE ---
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = '<i class="fas fa-sun"></i>';
    const moonIcon = '<i class="fas fa-moon"></i>';

    // Vérifier si un thème est déjà sauvegardé
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = sunIcon;
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = sunIcon;
            localStorage.setItem('theme', 'dark'); // Sauvegarde le choix
        } else {
            themeToggle.innerHTML = moonIcon;
            localStorage.setItem('theme', 'light'); // Sauvegarde le choix
        }
    });
}

// N'oubliez pas d'appeler la fonction à la fin du fichier JS
// Dans la section --- INITIALISATION ---
initThemeToggle();
});