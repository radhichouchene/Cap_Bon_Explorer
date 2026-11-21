// les 8 activités (tableau d'objets)
const activities = [
    { id: "A01", title: "Découverte de la médina", category: "Culture", location: "Nabeul", duration: "2 h", price: 20,
      image: "images/la médina.avif", hook: "Découvrez les traditions de Nabeul.",
      description: "Visitez les ruelles de la médina. Découvrez les boutiques traditionnelles. Apprenez l'histoire de cette ville." },

    { id: "A02", title: "Atelier d'initiation à la poterie", category: "Artisanat", location: "Nabeul", duration: "1 h 30", price: 35,
      image: "images/la poterie.jpg", hook: "Découvrez l'art de la poterie.",
      description: "Découvrez la poterie traditionnelle. Apprenez les premières étapes de fabrication. Explorez le savoir-faire des artisans." },

    { id: "A03", title: "Parcours découverte de Kerkouane", category: "Culture", location: "Kerkouane", duration: "2 h 30", price: 30,
      image: "images/Kerkouane.webp", hook: "Découvrez l'histoire de Kerkouane.",
      description: "Visitez le site archéologique. Découvrez les vestiges puniques. Apprenez l'histoire ancienne de la région." },

    { id: "A04", title: "Randonnée découverte", category: "Nature", location: "Djebel Abderrahmane", duration: "3 h", price: 25,
      image: "images/découverte.avif", hook: "Profitez de la beauté de la nature.",
      description: "Explorez le Djebel Abderrahmane. Découvrez ses paysages naturels. Profitez d'une belle randonnée." },

    { id: "A05", title: "Circuit du littoral", category: "Nature", location: "Kélibia", duration: "3 h", price: 40,
      image: "images/klebia.webp", hook: "Explorez le littoral de Kélibia.",
      description: "Découvrez les paysages de Kélibia. Profitez des vues sur la Méditerranée. Explorez la beauté de la côte." },

    { id: "A06", title: "Peinture sur céramique", category: "Artisanat", location: "Nabeul", duration: "2 h", price: 25,
      image: "images/images (4).jpg", hook: "Exprimez votre créativité.",
      description: "Découvrez la décoration sur céramique. Utilisez différentes couleurs et motifs. Créez votre propre décoration." },

    { id: "A07", title: "Découverte d'un marché local", category: "Découverte", location: "Nabeul", duration: "1 h 30", price: 15,
      image: "images/caption.jpg", hook: "Découvrez les produits locaux.",
      description: "Visitez le marché de Nabeul. Découvrez les produits et les couleurs des étals. Observez la vie quotidienne locale." },

    { id: "A08", title: "Promenade photographique", category: "Découverte", location: "Hammamet", duration: "2 h 30", price: 30,
      image: "images/Promenade .webp", hook: "Photographiez les beaux paysages.",
      description: "Explorez les rues de Hammamet. Photographiez les paysages et les monuments. Gardez de beaux souvenirs de votre visite." }
];

// les éléments de la page
const liste = document.getElementById("activities-list");
const recherche = document.getElementById("search");
const categorie = document.getElementById("category");
const tri = document.getElementById("sort");
const compteur = document.getElementById("result-count");
const aucun = document.getElementById("no-results");

let resultats = [];   // les activités affichées en ce moment

// remplir la fenêtre modale avec l'activité choisie
function afficherDetails(numero) {
    const a = resultats[numero];

    document.getElementById("modal-title").innerText = a.title;
    document.getElementById("modal-info").innerText = a.category + " | " + a.location + " | " + a.duration + " | " + a.price + " TND / personne";
    document.getElementById("modal-description").innerText = a.description;
    document.getElementById("modal-reserve").href = "reservation.html?id=" + a.id;
}

// afficher les cartes : recherche + catégorie, puis tri par prix
function afficher() {
    const mot = recherche.value.toLowerCase().trim();

    // 1) garder seulement les activités qui correspondent à la recherche ET à la catégorie
    resultats = [];
    for (let i = 0; i < activities.length; i++) {
        const a = activities[i];
        const texte = (a.title + " " + a.location).toLowerCase();

        const motOk = texte.includes(mot);
        const categorieOk = categorie.value === "Toutes" || a.category === categorie.value;

        if (motOk && categorieOk) {
            resultats.push(a);
        }
    }

    // 2) trier par prix si demandé
    if (tri.value === "croissant") {
        resultats.sort(function (a, b) { return a.price - b.price; });
    } else if (tri.value === "decroissant") {
        resultats.sort(function (a, b) { return b.price - a.price; });
    }

    // 3) créer une carte pour chaque activité gardée
    let html = "";
    for (let i = 0; i < resultats.length; i++) {
        const a = resultats[i];
        html += `
                <div class="col-12 col-md-6 col-lg-4">
                    <article class="card place-card">
                        <img src="${a.image}" class="card-img-top" alt="${a.title} - ${a.location}">
                        <div class="card-body">
                            <small>${a.category.toUpperCase()}</small>
                            <h3>${a.title}</h3>
                            <p>${a.hook}</p>
                            <p class="mb-0">${a.location} - ${a.duration}</p>
                            <div class="card-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <strong>${a.price} TND / personne</strong>
                                <div>
                                    <button type="button" class="btn-site btn-blue details-btn" data-numero="${i}"
                                        data-bs-toggle="modal" data-bs-target="#activityModal">Voir les détails</button>
                                    <a href="reservation.html?id=${a.id}" class="btn-site btn-orange">Réserver</a>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>`;
    }

    liste.innerHTML = html;
    compteur.innerText = resultats.length + " activité(s) trouvée(s)";

    if (resultats.length === 0) {
        aucun.style.display = "block";
    } else {
        aucun.style.display = "none";
    }

    // chaque bouton "Voir les détails" remplit la modale avec sa propre activité
    const boutons = document.querySelectorAll(".details-btn");
    for (let i = 0; i < boutons.length; i++) {
        boutons[i].addEventListener("click", function () {
            afficherDetails(boutons[i].dataset.numero);
        });
    }
}

// la liste se met à jour pendant la saisie et au changement de catégorie ou de tri
recherche.addEventListener("input", afficher);
categorie.addEventListener("change", afficher);
tri.addEventListener("change", afficher);

afficher();   // premier affichage : les 8 cartes
