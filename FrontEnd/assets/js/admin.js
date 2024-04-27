// Déclaration de fonction

/**
 * Retourne TRUE / FALSE si l'utilisateur est connecté
 */
function isUserConnected() {
  const token = localStorage.getItem("token");

  if (token) {
    return true;
  } else {
    return false;
  }
}

/**
 * Modifie l'affichage dans la navigation du bouton login qui devient "logout"
 */
function toggleButtonLogout() {
  const buttonLogin = document.querySelector("#buttonLogin");
  buttonLogin.innerText = "logout";
}

/**
 * Créer les boutons d'administration et les affiches sur la page
 */
function createAdminButtons() {
  // Création de la banner
  const banner = document.createElement("div");
  banner.classList.add("banner-edit");
  banner.innerHTML = `<div>
    <span><i class="fa-regular fa-pen-to-square padding11"></i>Mode édition</span>
  </div>`;

  // Création du bouton modifier
  const button = document.createElement("button");
  button.classList.add("btn-edit");
  button.innerHTML = `<span><i class="fa-regular fa-pen-to-square padding10"></i>Modifier</span>`;

  // Ajout dans le DOM
  const editionMode = document.querySelector("#editionMode");
  editionMode.append(banner);

  const editAdmin = document.querySelector("#editAdmin");
  editAdmin.append(button);

  // Events : affiche la modal works
  banner.addEventListener("click", createModalWorks);
  button.addEventListener("click", createModalWorks);
}

/**
 * Récupère les projets pour la modale sur l'API avec le fetch méthode GET
 */
async function getWorks() {
  let works = [];
  await fetch("http://localhost:5678/api/works", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      works = data;
    });
  // console.log(works);
  return works;
}

/**
 * Suppression de l'affichage sur la page d'accueil + suppression affichage dans la modale
 */
function removeDisplayWork(id) {
  const work = document.querySelector(`.work[id="${id}"]`);
  work.remove();

  const project = document.querySelector(`.project[id="${id}"]`);
  project.remove();
}

/**
 * Suppression d'un projet
 */
function removeWork(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    removeDisplayWork(id);
  });
}

/**
 * Créer la modal des projets et l'affiche sur la page
 */
async function createModalWorks() {
  const spaceModals = document.querySelector("#spaceModals");

  // Création de la modale
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.setAttribute("id", "modalWorks");
  modal.innerHTML = ``;
  spaceModals.append(modal); // Ajout de la modale dans le DOM

  // Création de l'intérieur de la modale
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
      <span id="spanClose" class="close">&times;</span>
      <h3>Galerie photo</h3>
      <div id="modalGallery" class="modale-gallery"></div>
      <div class="gray-line"></div>
  `;
  modal.append(modalContent); // Ajout de l'intérieur de la modale dans la modale

  // Remplissage de la modale avec les projets
  const works = await getWorks();
  works.forEach((work) => {
    // Création de la div d'un projet
    const item = document.createElement("div");
    const figure = document.createElement("figure");
    const picture = document.createElement("img");

    item.setAttribute("id", work.id);

    // on leur donne les valeurs suivantes
    picture.src = work.imageUrl;
    picture.alt = work.title;

    // // puis on les ajoute à cet endroit dans le html
    item.append(figure);
    figure.append(picture);

    item.classList.add("work");

    modalGallery.append(item); // Ajout de l'affichage du projet dans la modale

    const button = document.createElement("button");
    button.classList.add("btnWorkRemove");
    button.innerHTML = `<i class="fa-solid fa-trash-can trash"></i>`;
    item.append(button); // Ajout du boutton à la fin de l'affichage du work

    // Event : Suppression d'un projet
    button.addEventListener("click", () => {
      removeWork(work.id);
    });
  });

  exitModals();

  // Crée le bouton "ajout d'un projet" et l'ajoute dans la modale
  const btnAddWork = document.createElement("button");
  btnAddWork.classList.add("btn-add-work");
  btnAddWork.innerHTML = "Ajouter une photo";

  modalContent.append(btnAddWork);

  // Event : passage à la modale suivante
  btnAddWork.addEventListener("click", () => {
    removeModalWorks();
    createModalForm();
    // console.log("test acces formulaire ajout photo");
  });
}

/**
 * Supprime la modal des projets
 */
function removeModalWorks() {
  const modal = document.querySelector("#modalWorks");
  modal.remove();
}

/**
 * Envoi des données à l'API pour la création d'un projet
 */
async function submitForm() {
  const formData = new FormData();

  // Récupère les valeurs du formulaire
  const title = document.querySelector("#inputTitle").value;
  const category = document.querySelector("#selection").value;
  const image = document.querySelector("#addPicInput").files[0];

  // Efface le message d'erreur dans l'ajout de projet en cas de saisie dans l'inputTitle
  inputTitle = document.addEventListener("change", (e) => {
    clearError();
  });

  // On vérifie qu'on a toutes les données
  // console.log(title, category, image);

  // Ajoute les valeurs au formData
  formData.append("title", title);
  formData.append("category", parseInt(category));
  formData.append("image", image);

  // Envoi de la requête POST à l'API
  fetch(`http://localhost:5678/api/works`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: formData,
  })
    .then((res) => {
      if (res.status !== 201) {
        throw Error(`${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      updateProjectWork(data); // ajoute le nouveau projet dans le DOM
      createModalWorks(); // ouvre la modale des projets
      removeModalForm(); // ferme la modale du formulaire
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue lors de l'envoi du formulaire.",
        error
      );
      // Vérifie que tous les champs sont remplis
      if (!image || !title) {
        errorSubmit(); // Affiche un message d'erreur si les champs ne sont pas remplis
        return; // Arrête l'exécution de la fonction
      }
    });
}
//-------------------------------------------------------------------------------
/**
 * Affiche une span avec un message d'erreur si tous les champs ne sont pas remplis
 */
function errorSubmit() {
  const modalContent = document.querySelector(".modal-content");
  const btnPostWork = document.querySelector(".btn-post-work");

  // Création de la span d'erreur si elle n'existe pas déjà
  let spanErrorSubmit = document.querySelector("#spanErrorSubmit");
  if (!spanErrorSubmit) {
    spanErrorSubmit = document.createElement("span");
    spanErrorSubmit.id = "spanErrorSubmit";
    spanErrorSubmit.classList.add("error-message");
    spanErrorSubmit.innerText = "Veuillez remplir tous les champs";
    modalContent.append(spanErrorSubmit); // Insère la span avant le bouton
  }

  // Cache le bouton de validation
  btnPostWork.style.display = "none";
}

// Fonction pour effacer le message d'erreur et réafficher le bouton de validation
function clearError() {
  const spanErrorSubmit = document.querySelector("#spanErrorSubmit");
  const btnPostWork = document.querySelector(".btn-post-work");

  if (spanErrorSubmit) {
    spanErrorSubmit.remove(); // Supprime la span d'erreur
    btnPostWork.style.display = "block"; // Réaffiche le bouton de validation
  }
}
// ----------------------------------------------------------------------------
/**
 *  Ajoute un nouveau projet dans le DOM
 */

function updateProjectWork(data) {
  const item = document.createElement("div");
  const figure = document.createElement("figure");
  const picture = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  // on leur donne les valeurs suivantes
  picture.src = data.imageUrl;
  picture.alt = data.title;
  figcaption.innerText = data.title;

  // puis on les ajoute à cet endroit dans le DOM
  gallery.append(item);
  item.append(figure);
  figure.append(picture);
  figure.append(figcaption);

  item.classList.add("project");
  item.setAttribute("id", data.id);
}

/**
 * Créer la modal du formulaire et l'afficher sur la page
 */
async function createModalForm() {
  const modal = document.createElement("div");

  modal.classList.add("modal");
  modal.setAttribute("id", "modalForm");
  modal.innerHTML = ``;
  spaceModals.append(modal); // Ajout de la modale dans le DOM

  // Affichage du contenu (formulaire)
  const modalContent = document.createElement("div");
  const addPicContainer = document.createElement("div");
  const previewNewPic = document.createElement("div");
  const selectedNewPic = document.createElement("img");
  const addPicContent = document.createElement("div");
  const addInputContainer = document.createElement("div");

  // Contenu et style de base de la modale du formulaire
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
      <span id="spanBack"><i class="fa-solid fa-arrow-left arrow"></i></span>
      <span id="spanClose" class="close">&times;</span>
      <h3>Ajout photo</h3>
      <div class="form-container"></div>
      <div class="gray-line"></div>
  `;

  modal.append(modalContent); // Ajout de l'intérieur de la modale dans la modale

  // Pointe la div qui englobe les 3 élements nécessaires à la création d'un projet
  const formContainer = document.querySelector(".form-container");

  // Ajout dans le DOM de la div du conteneur de la partie photo
  formContainer.append(addPicContainer);
  addPicContainer.classList.add("add-pic-container");

  // Ajout dans le DOM de la div où s'affichera la photo sélectionnée
  addPicContainer.append(previewNewPic);
  previewNewPic.classList.add("preview-new-pic");

  //  Ajout dans le DOM de la div qui contient le content relatif à la selection de la nouvelle photo
  addPicContainer.append(addPicContent);
  addPicContent.classList.add("add-pic-content");
  addPicContent.innerHTML = `
  <span id="iconPic" class="icon-pic">
    <i class="fa-regular fa-image"></i>
    </span>
  <input type="file" name="addPicInput" class="add-pic-input" id="addPicInput">
  <label id="addPicLabel" class="add-pic-label" for="addPicInput">+ Ajouter photo</label>
  <p id="addPicTxt">jpg, png : 4mo max</p>
  `;

  // Ajout dans le DOM de la nouvelle image et de ses attributs
  previewNewPic.append(selectedNewPic);
  selectedNewPic.setAttribute("src", "#");
  selectedNewPic.setAttribute("alt", "image choisie");
  selectedNewPic.setAttribute("id", "imageDisplay");
  selectedNewPic.classList.add("image-display");
  selectedNewPic.style.display = "none";

  // Ajout dans le DOM de la div qui englobe l'imput du titre et le select de la catégorie pour la nouvelle photo
  formContainer.append(addInputContainer);
  addInputContainer.classList.add("add-input-container");

  // Ajout de l'input texte du titre du select des catégories
  addInputContainer.innerHTML = `
  <label for="inputTitle">Titre</label>
  <input type="text" name="title" id="inputTitle">
  <label for="selection">Catégorie</label>
  <select id="selection" class="selection"></select>`;

  // Ajout des options du select des catégories
  let selectCategories = [];
  await getSelectCategories();
  selectCategories.forEach((selectCategory) => {
    const selectOptions = document.createElement("option");
    selectOptions.value = selectCategory.id;
    selectOptions.innerText = `${selectCategory.name}`;
    selection.append(selectOptions);
    // console.log(selectOptions.value, selectOptions.innerText);
  });

  /**
   * Dès que l'utilisateur sélectionne une image, l'afficher et mettre à jour le contenu
   */
  const addPicInput = document.querySelector(".add-pic-input");
  const addInputContent = document.querySelector(".add-pic-content");

  // Recupérer les catégories
  async function getSelectCategories() {
    await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => (selectCategories = data));
    // console.log(selectCategories);
  }

  addPicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const imageUrl = reader.result;
      selectedNewPic.src = imageUrl; // Affichage de l'image sélectionnée dans l'élément <img>
      selectedNewPic.style.display = "flex"; // Afficher l'élément <img>
      addInputContent.style.display = "none"; // Masquer le contenu d'ajout de l'image
    };

    if (file) {
      reader.readAsDataURL(file); // Lecture du contenu de l'image sélectionnée
    }
  });

  /**
   * Créer le bouton "Valider" et l'ajouter dans la modale
   */
  const btnPostWork = document.createElement("button");
  btnPostWork.classList.add("btn-post-work");
  btnPostWork.innerHTML = "Valider";

  modalContent.append(btnPostWork);

  // Event : Envoi du formulaire
  btnPostWork.addEventListener("click", submitForm);

  exitModals();
  backModalWorks();
}

/**
 * Supprime la modal du formulaire
 */
function removeModalForm() {
  const modal = document.querySelector("#modalForm");
  modal.remove();
}

/**
 * Quitte et supprime les modales au click sur le bouton croix spanClose
 */
function exitModals() {
  const spanClose = document.querySelector("#spanClose");
  const modal = document.querySelector(".modal");
  spanClose.addEventListener("click", () => {
    modal.remove();
  });

  /**
   * Quitte et supprime les modales au click n'importe ou en dehors de la modale
   */
  window.addEventListener("click", (e) => {
    const modal = document.querySelector(".modal");

    if (e.target == modal) {
      modal.remove();
    }
  });
}

/**
 *  Supprime la deuximème modale (modalForm) et retourne sur la première modale (modalWorks) au click sur le bonton flèche (spanBack)
 */
function backModalWorks() {
  spanBack.addEventListener("click", () => {
    removeModalForm();
    createModalWorks();
  });
}

// Execution du code
if (isUserConnected()) {
  toggleButtonLogout();
  createAdminButtons();
}
