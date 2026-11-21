// les éléments du formulaire
const form = document.getElementById("reservation-form");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const email = document.getElementById("email");
const telephone = document.getElementById("telephone");
const activity = document.getElementById("activity");
const dateInput = document.getElementById("date");
const participants = document.getElementById("participants");
const accept = document.getElementById("accept");
const individuel = document.getElementById("type1");
const erreur = document.getElementById("error-message");
const resultat = document.getElementById("result");

// si on arrive depuis la page Activités, l'adresse contient ?id=A02 : on choisit l'activité
const id = new URLSearchParams(window.location.search).get("id");
if (id) {
    activity.value = id;
}

// calcul du prix : sous-total, remise de 10 % à partir de 4 personnes, total
function calculer() {
    const prix = Number(activity.options[activity.selectedIndex].dataset.price);
    const n = Number(participants.value);

    let sousTotal = prix * n;
    if (n < 1 || n > 6) {
        sousTotal = 0;
    }

    let remise = 0;
    if (n >= 4) {
        remise = sousTotal * 10 / 100;
    }

    document.getElementById("unit-price").innerText = prix + " TND";
    document.getElementById("subtotal").innerText = sousTotal + " TND";
    document.getElementById("discount").innerText = remise + " TND";
    document.getElementById("total").innerText = (sousTotal - remise) + " TND";

    // "Individuel" n'a pas de sens s'il y a plus d'une personne
    individuel.disabled = n > 1;
    if (n > 1) {
        individuel.checked = false;
    }
}

// le prix se met à jour tout seul quand on change l'activité ou le nombre de participants
activity.addEventListener("change", calculer);
participants.addEventListener("input", calculer);

// bouton "Valider la simulation"
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const erreurs = [];
    const aujourdhui = new Date().toISOString().slice(0, 10);   // AAAA-MM-JJ
    const n = Number(participants.value);

    if (nom.value.trim() === "") {
        erreurs.push("Le nom est obligatoire.");
    }
    if (prenom.value.trim() === "") {
        erreurs.push("Le prénom est obligatoire.");
    }
    if (!email.checkValidity() || !email.value.includes(".")) {
        erreurs.push("L'adresse e-mail n'est pas valide (exemple : nom@mail.com).");
    }
    if (telephone.value.trim() === "") {
        erreurs.push("Le téléphone est obligatoire.");
    }
    if (activity.value === "") {
        erreurs.push("Veuillez choisir une activité.");
    }
    if (dateInput.value === "") {
        erreurs.push("Veuillez choisir une date.");
    } else if (dateInput.value < aujourdhui) {
        erreurs.push("La date choisie est déjà passée.");
    }
    if (participants.value === "" || n < 1 || n > 6) {
        erreurs.push("Le nombre de participants doit être entre 1 et 6.");
    }
    if (!document.querySelector('input[name="type"]:checked')) {
        erreurs.push("Veuillez choisir un type de participation.");
    }
    if (!accept.checked) {
        erreurs.push("Vous devez accepter les conditions de simulation.");
    }

    // s'il y a des erreurs : on les affiche et on s'arrête
    if (erreurs.length > 0) {
        erreur.innerHTML = "<strong>Veuillez corriger :</strong><ul class='mb-0'><li>" + erreurs.join("</li><li>") + "</li></ul>";
        erreur.style.display = "block";
        resultat.style.display = "none";
        return;
    }

    // sinon : récapitulatif (la date AAAA-MM-JJ devient JJ/MM/AAAA)
    const dateFr = dateInput.value.split("-").reverse().join("/");

    document.getElementById("result-info").innerText =
        "Activité : " + activity.options[activity.selectedIndex].text +
        " | Date : " + dateFr +
        " | Participants : " + n +
        " | Total : " + document.getElementById("total").innerText;

    erreur.style.display = "none";
    resultat.style.display = "block";
});

// bouton "Réinitialiser"
document.getElementById("reset").addEventListener("click", function () {
    form.reset();
    erreur.style.display = "none";
    resultat.style.display = "none";
    calculer();
});

calculer();   // affichage initial : 0 TND