let projects = [];
let btnCategories = [];
const gallery = document.querySelector(".gallery");
const categories = document.querySelector(".categories");
const contacts = document.querySelector("#contacts");
const projets = document.querySelector("#projets");
const log = document.querySelector("#buttonLogin");

/**
 * Redirige vers la page d'accueil administrateur ou sur la page de login et gère la suppression du token à la déconnexion.
 */
log.addEventListener("click", () => {
  if (log.innerText == "logout") {
    // Si le bouton = "logout", supprime le token et redirige vers la page d'accueil version client
    localStorage.removeItem("token");
    window.location.href = "index.html";
  } else {
    // Sinon (le bouton = "login"), redirection vers la page "login"
    window.location.href = "login.html";
  }
});

/**
 * Redirection au clic sur les liens dans la nav
 */

contacts.addEventListener("click", () => {
  window.location.href = "#contact"; // Redirection vers la section Contact
});
projets.addEventListener("click", () => {
  window.location.href = "#portfolio"; // Redirection vers la section Mes projets
  // console.log("projets");
});

/**
 * Récupération des projets sur l'API avec le fetch et la méthode GET
 */
async function getProjects() {
  await fetch("http://localhost:5678/api/works", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => (projects = data));
  // console.log(projects);
  projectsDisplay(); // Appel de la fonction qui passe en revue tous les projets récupérés dans l'API et les créés dans le DOM
}
getProjects(); // Appel de la fonction qui récupère les projets sur l'API

/**
 * Parcours des projets reçus depuis l'API et création dans le DOM
 */
function projectsDisplay() {
  gallery.innerHTML = "";
  // pour chaque projet, on crée les éléments suivants
  projects.forEach((project) => {
    // console.log(project);
    updateProjectWork(project); // fonction qui permet de créer un projet dans le DOM
  });
}

/**
 * Recupération des catégories sur l'API avec le fetch et la méthode GET
 */
async function getCategories() {
  await fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => (btnCategories = data));
  // console.log(btnCategories);
  btnCategoriesDisplay();
}
getCategories(); // Appel de la fonction qui récupère les catégories sur l'API

// Affichage des boutons de catégories
function btnCategoriesDisplay() {
  // Création un container qui englobera tous les boutons de filtres
  const filtersContainer = document.createElement("div");
  categories.append(filtersContainer);
  filtersContainer.classList.add("filters-container");

  // Création du bouton de filtre "Tous"
  const input = document.createElement("input");
  filtersContainer.append(input);
  input.classList.add("input-categories");
  input.classList.add("input-selected");
  input.setAttribute("id", 0);
  input.setAttribute("type", "button");
  input.setAttribute("value", "Tous");

  /**
   * Parcours des catégories reçues depuis l'API et création dans le DOM
   */
  btnCategories.forEach((btnCategory) => {
    const inputCategories = document.createElement("input");
    inputCategories.classList.add("input-categories");

    // on leur donne les valeurs suivantes
    inputCategories.id = btnCategory.id;
    inputCategories.name = btnCategory.name;
    inputCategories.value = btnCategory.name;

    // puis on les ajoute à cet endroit dans le DOM
    filtersContainer.append(inputCategories);
    inputCategories.setAttribute("type", "button");
  });
  filterCategories(); // Appel de la fonction qui filtre les projets quand on clique sur les boutons de filtres des catégories
}

/**
 * Filtre les projets en cliquant sur les boutons de filtres des catégories
 **/
function filterCategories() {
  const inputCategories = document.querySelectorAll(".input-categories");
  inputCategories.forEach((inputCategory) => {
    inputCategory.addEventListener("click", (e) => {
      // console.log(e.target.id);

      // changer la couleur du bouton du filtre séléctionné
      inputCategories.forEach((category) => {
        category.classList.remove("input-selected"); // enlève la classe "input-selected" qui donne le style du filtre selectionné à tous les boutons
      });
      e.target.classList.add("input-selected"); // et le remet sur l'élément cliqué

      /**
       * Affichage des projets de la catégorie selectionnée
       */
      if (e.target.value === "Tous") {
        // Si le filtre cliqué est égal à "Tous"
        gallery.innerHTML = ""; // Vide l'intégralité de la galerie du portfolio
        projectsDisplay(); // Appel de la fonction qui parcours et crée les projets recus de l'API dans le DOM
      } else {
        // Sinon on filtre uniquement les projets avec l'id du filtre cliqué
        const filteredProjects = projects.filter(
          (project) => project.categoryId === parseInt(e.target.id)
        );
        gallery.innerHTML = ""; // On vide entièrement la galerie du portfolio
        filteredProjects.forEach((project) => {
          // et on crée chaque projet filtré dans le DOM
          const figure = document.createElement("figure");
          const picture = document.createElement("img");
          const figcaption = document.createElement("figcaption");

          picture.src = project.imageUrl;
          picture.alt = project.title;
          figcaption.innerText = project.title;

          gallery.append(figure);
          figure.append(picture);
          figure.append(figcaption);
        });
      }
    });
  });
}
