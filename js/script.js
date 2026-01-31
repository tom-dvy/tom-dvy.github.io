document.addEventListener('DOMContentLoaded', function() {
    
    // --- GESTION DES TRANSITIONS DE PAGE ---
    // Sélectionne l'élément <body> de la page pour lui appliquer des animations.
    const body = document.body;

    // ANIMATION D'ENTRÉE : faire apparaître la page
    window.addEventListener('load', () => {
        // On initialise la position de départ de l'animation d'entrée : le corps de la page est légèrement décalé vers le haut.
        body.style.transform = 'translateY(-15px)';

        setTimeout(() => {
            body.classList.add('is-visible');
        }, 50);
    });

    // ANIMATION DE SORTIE : faire disparaître la page
    // Sélectionne tous les liens (balises <a>) de la page.
    const allLinks = document.querySelectorAll('a');

    // Parcourt chaque lien trouvé pour lui ajouter un gestionnaire d'événement au clic.
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Récupère la destination (l'attribut href) du lien cliqué.
            const href = this.getAttribute('href');
            // Vérifie si le lien est local vers une autre page du site.
            const isLocalLink = href && (href.startsWith('../html/') || href.endsWith('.html'));
            // Vérifie si le lien doit s'ouvrir dans un nouvel onglet.
            const isTargetBlank = this.getAttribute('target') === '_blank';
            // Vérifie si le lien est interne à la page actuelle.
            const isHashLink = href && href.startsWith('#');
            // Vérifie si le lien est un lien de téléchargement.
            const isDownloadLink = this.hasAttribute('download');

            if (isLocalLink && !isTargetBlank && !isHashLink && !isDownloadLink) {
                e.preventDefault();
                
                // On ajoute la classe qui déclenche l'animation de sortie (fade out et déplacement vers le haut).
                body.classList.add('is-leaving');

                // On attend la fin de l'animation de sortie avant de réellement changer de page.
                setTimeout(() => {
                    // Redirige manuellement le navigateur vers la nouvelle page.
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // --- Gestion du menu Hamburger pour mobile ---
    // Sélectionne le bouton du menu hamburger.
    const toggler = document.querySelector('.navbar-toggler');
    // Sélectionne le conteneur du menu de navigation.
    const menu = document.querySelector('.navbar .menu');

    // Vérifie que le bouton et le menu existent bien sur la page pour éviter les erreurs.
    if (toggler && menu) {
        // Ajoute un écouteur d'événement sur le clic du bouton.
        toggler.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // --- Gestion du filtre du Portfolio (version simple, potentiellement pour une autre page ou une ancienne version) ---
    // Sélectionne le conteneur des boutons de filtre.
    const filterContainer = document.querySelector('.conteneur-btn');
    if (filterContainer) {
        // Sélectionne tous les boutons de filtre à l'intérieur.
        const filterButtons = filterContainer.querySelectorAll('.bouton');
        // Sélectionne tous les éléments de projet à filtrer.
        const projectItems = document.querySelectorAll('.projet-item');

        // Pour chaque bouton de filtre
        filterButtons.forEach(button => {
            // ...ajoute un écouteur d'événement au clic.
            button.addEventListener('click', () => {
                // Retire la classe 'active' de tous les boutons pour réinitialiser leur style.
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Ajoute la classe 'active' uniquement au bouton qui vient d'être cliqué.
                button.classList.add('active');

                // Récupère la valeur du filtre depuis l'attribut 'data-filter' du bouton cliqué.
                const filter = button.dataset.filter;

                // Parcourt chaque élément de projet.
                projectItems.forEach(item => {
                    // Si le filtre est 'all' ou si la catégorie de l'élément correspond au filtre...
                    if (filter === 'all' || item.dataset.category === filter) {
                        // ...on s'assure qu'il est visible en retirant la classe 'hidden'.
                        item.classList.remove('hidden');
                    } else {
                        // ...sinon, on le masque en ajoutant la classe 'hidden'.
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // GESTION DE LA FERMETURE DES POP-UPS (overlays)
    // Sélectionne tous les overlays (fenêtres pop-up) de la page.
    const overlays = document.querySelectorAll('.overlay');
    // Si des overlays sont trouvés...
    if (overlays.length > 0) {
        // ...parcourt chacun d'eux.
        overlays.forEach(overlay => {
            // Trouve le bouton de fermeture (la croix) à l'intérieur de l'overlay.
            const closeButton = overlay.querySelector('.close');
            // Si un bouton de fermeture existe...
            if (closeButton) {
                // ...lui ajoute un écouteur de clic.
                closeButton.addEventListener('click', e => {
                    // Empêche le comportement par défaut (si c'est un lien).
                    e.preventDefault();
                    // Modifie le hash de l'URL pour fermer le pop-up (basé sur le sélecteur CSS :target).
                    window.location.hash = '#!';
                });
            }
            // Ajoute un écouteur de clic sur le fond de l'overlay.
            overlay.addEventListener('click', e => {
                // Si l'élément cliqué est bien le fond de l'overlay lui-même (et non son contenu)...
                if (e.target === overlay) {
                    // ...ferme le pop-up.
                    window.location.hash = '#!';
                }
            });
        });
        
        // Ajoute un écouteur d'événement global pour les touches du clavier.
        window.addEventListener('keydown', e => {
            // Si la touche pressée est "Echap" ET qu'un pop-up est actuellement ouvert (son hash commence par #overlay)...
            if (e.key === 'Escape' && window.location.hash.startsWith('#overlay')) {
                // ...ferme le pop-up.
                window.location.hash = '#!';
            }
        });
    }

    // --- GESTION DU MODE SOMBRE ---
    // Définit la fonction qui initialise la logique du mode sombre.
    function initThemeToggle() {
        // Sélectionne le bouton de changement de thème.
        const themeToggle = document.getElementById('theme-toggle');
        // Stocke le code HTML pour l'icône soleil.
        const sunIcon = '<i class="fas fa-sun"></i>';
        // Stocke le code HTML pour l'icône lune.
        const moonIcon = '<i class="fas fa-moon"></i>';

        // Au chargement de la page, vérifie si un thème a été sauvegardé dans le stockage local du navigateur.
        if (localStorage.getItem('theme') === 'dark') {
            // Si le thème 'dark' est sauvegardé, applique la classe 'dark-mode' au corps de la page.
            document.body.classList.add('dark-mode');
            // Met à jour l'icône du bouton pour afficher le soleil (passer en mode clair).
            themeToggle.innerHTML = sunIcon;
        }

        // Ajoute un écouteur de clic sur le bouton de thème.
        themeToggle.addEventListener('click', () => {
            // Alterne la classe 'dark-mode' sur le corps de la page.
            document.body.classList.toggle('dark-mode');

            // Si le mode sombre est maintenant activé...
            if (document.body.classList.contains('dark-mode')) {
                // ...affiche l'icône du soleil.
                themeToggle.innerHTML = sunIcon;
                // ...et sauvegarde ce choix dans le stockage local.
                localStorage.setItem('theme', 'dark');
            } else {
                // Sinon (le mode clair est activé)...
                // ...affiche l'icône de la lune.
                themeToggle.innerHTML = moonIcon;
                // ...et sauvegarde ce choix.
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Appelle la fonction d'initialisation du mode sombre.
    initThemeToggle();

    // --- DONNÉES DES PROJETS ---
    // Définit un tableau d'objets contenant les informations de chaque projet du portfolio.
    const mesProjets = [
      {
        category: "3d",
        title: "Lego FC Barcelone",
        subtitle: "Modélisation 3D",
        description: "Création d'un personnage LEGO sur Blender lors d'un workshop à l'IIM.",
        image: "../img/DAVY_Tom_LegoFCB.png",
        details: {
          role: "Modélisateur 3D, Texturing",
          tools: "Blender"
        }
      },
      {
        category: "jeux",
        title: "Hyrome Fighter",
        subtitle: "Jeu de Combat 2D",
        description: "Projet de fin de BTS. Un jeu de combat 2D développé avec Scratch.",
        image: "../img/HyromeFighter.PNG",
        details: {
          role: "Développeur Gameplay",
          tools: "Scratch"
        }
      },
      {
        category: "3d",
        title: "Affiche NDW",
        subtitle: "Communication Visuelle",
        description: "Proposition d'affiche pour l'événement Nantes Digital Week.",
        image: "../img/Affiche Beaujoire.PNG",
        details: {
          role: "Graphiste",
          tools: "Adobe Photoshop, Illustrator"
        }
      },
      {
        category: "app",
        title: "Dashboard Énergie",
        subtitle: "Data visualisation",
        description: "Interface pour la visualisation de données de consommation énergétique.",
        image: "../img/ConsoEnergie.PNG",
        details: {
          role: "Développeur Front-End",
          tools: "C, Eclipse"
        }
      },
      {
        category: "app",
        title: "Grainothèque Connectée",
        subtitle: "Site Web",
        description: "Conception et prototypage d'un site pour une grainothèque connectée.",
        image: "../img/ihm_accueil.png",
        details: {
          role: "Développeur Front-End et Back-End",
          tools: "HTML, CSS, Javascript, Nodejs"
        }
      },
      {
        category: "app",
        title: "Pokédex",
        subtitle: "Application",
        description: "Conception d'une application Pokédex fonctionnelle et accessible.",
        image: "../img/pokedex.png",
        details: {
          role: "Développeur Front-End et Back-End",
          tools: "HTML, CSS, Javascript, PokeAPI"
        }
      }
    ];

    // --- GESTION DU PORTFOLIO (CARROUSEL 3D + FILTRES) ---
    // Définit la fonction principale pour initialiser le portfolio.
    function initPortfolio() {
        // Sélectionne le conteneur du carrousel.
        const container = document.getElementById('carousel-container');
        // Si le conteneur n'est pas trouvé (on n'est pas sur la page du portfolio), on arrête la fonction.
        if (!container) return; 

        // Crée une copie du tableau des projets pour pouvoir la filtrer sans modifier l'original.
        let currentProjects = [...mesProjets];
        // Initialise l'index de la diapositive (slide) actuellement affichée au centre.
        let slideIndex = 0;
        
        // Fonction pour créer et afficher les diapositives du carrousel.
        function renderCarousel() {
            // Vide le contenu actuel du carrousel pour le reconstruire.
            container.innerHTML = '';

            // Si, après filtrage, il n'y a aucun projet, affiche un message.
            if (currentProjects.length === 0) {
                container.innerHTML = '<p>Aucun projet dans cette catégorie.</p>';
                return;
            }

            // Crée un élément pour envelopper toutes les diapositives.
            const slidesWrapper = document.createElement('div');
            slidesWrapper.className = 'slides';

            // Définit le nombre de diapositives à afficher de chaque côté de la diapositive active.
            const slidesToShow = 2;

            // Parcourt la liste des projets (filtrés) pour créer une diapositive pour chacun.
            currentProjects.forEach((projet, i) => {
                const offset = slideIndex - i;
                const dir = offset === 0 ? 0 : offset > 0 ? 1 : -1;
                // Détermine si la diapositive est trop éloignée pour être visible.
                const isHidden = Math.abs(offset) > slidesToShow;

                // Crée un élément <a> qui servira de diapositive cliquable.
                const slideLink = document.createElement('a');
                slideLink.className = 'slide';
                
                const originalIndex = mesProjets.findIndex(p => p.title === projet.title);
                slideLink.href = `#overlay${originalIndex + 1}`;

                // Applique les styles via des propriétés CSS personnalisées (--offset, --dir) qui contrôlent la position et l'animation en CSS.
                slideLink.style.setProperty('--offset', offset);
                slideLink.style.setProperty('--dir', dir);
                // Définit l'image de fond de la diapositive.
                slideLink.style.backgroundImage = `url('${projet.image}')`;
                
                // Ajoute des attributs 'data' pour le style et la sélection en JS/CSS.
                if (isHidden) slideLink.setAttribute('data-hidden', true);
                if (offset === 0) slideLink.setAttribute('data-active', true);

                // Ajoute le contenu HTML (titre, sous-titre, description) à l'intérieur de la diapositive.
                slideLink.innerHTML = `
                    <div class="slide-content-inner">
                        <h2 class="slide-title">${projet.title}</h2>
                        <h3 class="slide-subtitle">${projet.subtitle}</h3>
                        <p class="slide-description">${projet.description}</p>
                    </div>`;
                
                slidesWrapper.appendChild(slideLink);
            });

            // Ajoute le conteneur des diapositives au carrousel principal.
            container.appendChild(slidesWrapper);

            if (currentProjects.length > 1) {
                const prevButton = document.createElement('button');
                prevButton.className = 'carousel-nav prev';
                prevButton.innerHTML = '‹';
                prevButton.onclick = () => {
                    slideIndex = (slideIndex - 1 + currentProjects.length) % currentProjects.length;
                    // Redessine le carrousel avec le nouvel index.
                    renderCarousel();
                };
                
                const nextButton = document.createElement('button');
                nextButton.className = 'carousel-nav next';
                nextButton.innerHTML = '›';
                nextButton.onclick = () => {
                    slideIndex = (slideIndex + 1) % currentProjects.length;
                    // Redessine le carrousel.
                    renderCarousel();
                };
                
                // Ajoute les boutons au conteneur du carrousel.
                container.appendChild(prevButton);
                container.appendChild(nextButton);
            }
            
            // Active l'effet d'inclinaison 3D sur la diapositive active.
            initTiltEffect();
        }

        // Fonction pour gérer l'effet 3D au survol de la souris.
        function initTiltEffect() {
            // Sélectionne uniquement la diapositive active.
            const activeSlide = document.querySelector('.slide[data-active]');
            if (!activeSlide) return; // Si aucune n'est active, ne fait rien.
            
            // Ajoute un écouteur pour le mouvement de la souris sur la diapositive active.
            activeSlide.addEventListener('mousemove', (e) => {
                const rect = activeSlide.getBoundingClientRect();
                // Calcule la position de la souris de -0.5 à +0.5 sur les axes X et Y.
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                // Met à jour les propriétés CSS personnalisées, qui sont utilisées par le CSS pour appliquer la transformation 3D.
                activeSlide.style.setProperty('--x', x);
                activeSlide.style.setProperty('--y', y);
            });
        }

        // Gestion des filtres intégrée au carrousel.
        const filterButtons = document.querySelectorAll('.conteneur-btn .bouton');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Met à jour la classe 'active' sur les boutons.
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                // Si le filtre est 'all', utilise la liste complète des projets.
                if (filter === 'all') {
                    currentProjects = [...mesProjets];
                } else {
                    // Sinon, filtre la liste des projets en fonction de la catégorie.
                    currentProjects = mesProjets.filter(p => p.category === filter);
                }
                // Réinitialise l'index à la première diapositive après avoir changé de filtre.
                slideIndex = 0;
                // Redessine le carrousel avec la nouvelle liste de projets.
                renderCarousel();
            });
        });

        // Premier appel pour afficher le carrousel au chargement de la page.
        renderCarousel();
    }


    // --- INITIALISATION ---
    // Appelle la fonction principale d'initialisation du portfolio.
    initPortfolio();
});