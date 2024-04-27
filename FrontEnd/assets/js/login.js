//  Variables

let email = document.getElementById("email");
let password = document.getElementById("password");
const inputLogin = document.querySelector("#loginForm input");
const span = document.querySelector("#loginForm span");
const formLogin = document.querySelector("#loginForm");

const logo = document.querySelector("#logo");
const contacts = document.querySelector("#contacts");
const projets = document.querySelector("#projets");
const token = localStorage.getItem("token");

/**
 * Fonction qui permet d'afficher un message d'erreur si la saisie est mauvaise
 */
function errorDisplay(message, valid) {
  if (!valid) {
    // Si la saisie n'est pas valide alors on ajoute des classes css et un message d'alerte pour notofier l'erreur
    inputLogin.classList.remove("inputBorderNone");
    inputLogin.classList.add("error");
    password.classList.add("error");
    span.textContent = message;
    span.classList.add("error_span");
  } else {
    // Sinon on enlève les classes css d'erreur et on efface le message d'alerte
    inputLogin.classList.add("inputBorderNone");
    inputLogin.classList.remove("error");
    password.classList.remove("error");
    span.textContent = "";
    span.classList.remove("error_span");
  }
}

/**
 * Fonction qui permet de vérifier que le format de l'adresse mail est correct
 */
function emailChecker(value) {
  if (!value.match(/^[\w_.-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    // Si le contenu ne respecte pas la condition de la regex, qu'il n'est pas au bon format, alors appelle la fonction "errorDisplay" avec un message d'erreur et retourne "false"
    errorDisplay("Erreur dans l’identifiant", false);
    return false;
  } else {
    errorDisplay("", true); // Sinon appelle la fonction "errorDisplay" sans message d'erreur et retourne "true"
    return true;
  }
}
email.addEventListener("input", (e) => {
  const value = e.target.value; // On récupère les données de l'input et on les donnes en paramètre à emailChecker
  emailChecker(value);
  // console.log(e.target.value);
});

/**
 * Fonction qui permet de vérifier que le mdp est valide
 */
function passwordChecker(value) {
  if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/)) {
    // Si le mdp n'est pas égal à "S0phie", alors appelle la fonction "errorDisplay" avec un message d'erreur et retourne "false"
    errorDisplay("Erreur dans le mot de passe", false);
    return false;
  } else {
    // Sinon appelle la fonction "errorDisplay" sans message d'erreur et retourne "true"
    errorDisplay("", true);
    return true;
  }
}
password.addEventListener("input", (e) => {
  const value = e.target.value; // On récupère les données de l'input et on les donnes en paramètre à passwordChecker
  passwordChecker(value);
  // console.log(e.target.value);
});

/**
 * Envoi de l'identifiant et du mdp à l'API avec le fetch méthode POST et récupération du token
 */
function connexionSubmit(emailValue, passwordValue) {
  const dataToSend = {
    email: "sophie.bluel@test.tld",
    password: "S0phie",
  };
  if (emailChecker(emailValue) && passwordChecker(passwordValue)) {
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Conversion au format JSON
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        // Il y a eun problème, on stop les then avec une erreur qui va dans le catch et log une erreur
        if (response.status !== 200) {
          throw new Error("Une erreur est survenue");
        }
        return response.json();
      })
      .then((data) => {
        // Sinon récuperère le token et l'enregistre dans le localStorage puis redirige vers la page d'accueil administrateur.
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      })
      .catch((err) => {
        errorDisplay("Une erreur est survenue", false);
      });
  }
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  connexionSubmit(emailValue, passwordValue);
});

// Actions au clic sur les liens dans la nav
logo.addEventListener("click", () => {
  // Click sur le logo = retour sur la page d'accueil
  window.location.href = "./index.html";
});
contacts.addEventListener("click", () => {
  // Click sur le bouton contact = redirection sur la section contact de la page d'accueil
  window.location.href = "./index.html#contact";
});
projets.addEventListener("click", () => {
  // Click sur le bouton projets = redirection sur la section "Mes projets" de la page d'accueil
  window.location.href = "./index.html#portfolio";
  // console.log("projets");
});
