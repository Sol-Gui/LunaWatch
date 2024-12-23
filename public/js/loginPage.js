const backButton = document.getElementById("backArrow");
const buttons = document.querySelector(".buttons");
const blueDiv = document.getElementById("blue-div");
const text = document.getElementById("text");
const toggleButton = document.getElementById("toggle-button");
const signUpForm = document.getElementById("toggle-sign-up");
const signInForm = document.getElementById("toggle-sign-in");

let rightBlueDiv = true;
let isMobile = window.innerWidth <= 1223;

function resetCSS() {
  blueDiv.style.transform = "";
  signUpForm.style.transform = "";
  signInForm.style.transform = "";
  buttons.style.transform = "";
  blueDiv.style.borderRadius = "";
  blueDiv.style.borderTopLeftRadius = "";
  blueDiv.style.borderBottomLeftRadius = "";
  blueDiv.style.borderTopRightRadius = "";
  blueDiv.style.borderBottomRightRadius = "";
}

function updateLayout() {
  const newIsMobile = window.innerWidth <= 1223;
  if (newIsMobile && !isMobile) {
    resetCSS();
  }
  isMobile = newIsMobile;
}

toggleButton.addEventListener("click", () => {
  if (isMobile) {
    if (signUpForm.classList.contains("hidden")) {
      signUpForm.classList.remove("hidden");
      signUpForm.classList.add("visible");
      signInForm.classList.remove("visible");
      signInForm.classList.add("hidden");
      toggleButton.textContent = "Sign In";
      text.textContent = "Login with your credentials for full access";
    } else {
      signUpForm.classList.remove("visible");
      signUpForm.classList.add("hidden");
      signInForm.classList.remove("hidden");
      signInForm.classList.add("visible");
      toggleButton.textContent = "Sign Up";
      text.textContent = "Register yourself for more useful tools!";
    }
  } else {
    if (signUpForm.classList.contains("hidden")) {
      if (rightBlueDiv) {
        blueDiv.style.transform = "translateX(-123%)";
        signUpForm.style.transform = "translateX(125%)";
        buttons.style.transform = "translateX(1000%)";
        blueDiv.style.borderRadius = "10em";
        blueDiv.style.borderTopLeftRadius = "2em";
        blueDiv.style.borderBottomLeftRadius = "2em";
        rightBlueDiv = false;
      } else {
        blueDiv.style.transform = "translateX(0)";
        signUpForm.style.transform = "translateX(0)";
        buttons.style.transform = "translateX(0)";
        blueDiv.style.borderRadius = "10em";
        blueDiv.style.borderTopRightRadius = "2em";
        blueDiv.style.borderBottomRightRadius = "2em";
        rightBlueDiv = true;
      }
      signUpForm.classList.remove("hidden");
      signUpForm.classList.add("visible");
      signInForm.classList.remove("visible");
      signInForm.classList.add("hidden");
      toggleButton.textContent = "Sign In";
      text.textContent = "Login with your credentials for full access";
    } else {
      if (rightBlueDiv) {
        blueDiv.style.transform = "translateX(-123%)";
        signInForm.style.transform = "translateX(125%)";
        buttons.style.transform = "translateX(1000%)";
        blueDiv.style.borderRadius = "10em";
        blueDiv.style.borderTopLeftRadius = "2em";
        blueDiv.style.borderBottomLeftRadius = "2em";
        rightBlueDiv = false;
      } else {
        blueDiv.style.transform = "translateX(0)";
        signInForm.style.transform = "translateX(0)";
        buttons.style.transform = "translateX(0)";
        blueDiv.style.borderRadius = "10em";
        blueDiv.style.borderTopRightRadius = "2em";
        blueDiv.style.borderBottomRightRadius = "2em";
        rightBlueDiv = true;
      }
      signUpForm.classList.remove("visible");
      signUpForm.classList.add("hidden");
      signInForm.classList.remove("hidden");
      signInForm.classList.add("visible");
      toggleButton.textContent = "Sign Up";
      text.textContent = "Register yourself for more useful tools!";
    }
  }
});

backButton.addEventListener("click", () => {
  window.location.href = '/';
});

window.addEventListener("resize", updateLayout);

updateLayout();