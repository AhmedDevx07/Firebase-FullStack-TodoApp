import {
  auth,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
} from "./firebase.js";

var firstBox = document.getElementsByClassName("signup-card")[0];
var secondBox = document.getElementsByClassName("login-card")[0];

document.querySelector("#pagechangelogin").addEventListener("click", () => {
  firstBox.style.display = "none";
  secondBox.style.display = "block";
});
document.querySelector("#pagechangesignup").addEventListener("click", () => {
  firstBox.style.display = "block";
  secondBox.style.display = "none";
});

function signup() {
  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Empty Fields",
      text: "Please fill all fields",
      confirmButtonColor: "#764ba2",
    });
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Welcome to our platform.",
        confirmButtonColor: "#764ba2",
      });
      firstBox.style.display = "none";
      secondBox.style.display = "block";
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document.querySelector("#signup").addEventListener("click", signup);

function login() {
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Glad to see you back!",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.href = "./todo.html";
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document.querySelector("#login").addEventListener("click", login);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in user:", user);
  }
});

function forgotPassword() {
  const email = document.querySelector("#loginEmail").value;
  if (!email) {
    Swal.fire({
      icon: "question",
      title: "Email Required",
      text: "Please enter your email in the login field first.",
      confirmButtonColor: "#764ba2",
    });
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      Swal.fire({
        icon: "info",
        title: "Email Sent",
        text: "Check your inbox for the reset link.",
        confirmButtonColor: "#764ba2",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document
  .querySelector("#forgotPassword")
  .addEventListener("click", forgotPassword);

function google() {
  signInWithPopup(auth, provider)
    .then((result) => {
      Swal.fire({
        icon: "success",
        title: "Google Login",
        text: "Authenticated successfully!",
      });
      window.location.href = "./todo.html";
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Google Auth Failed",
        text: error.message,
      });
    });
}
document
  .querySelectorAll("#googleLogin")
  .forEach((btn) => btn.addEventListener("click", google));
