document.addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("text");
  const toggleButton = document.getElementById("toggle-button");
  const signUpForm = document.getElementById("toggle-sign-up");
  const signInForm = document.getElementById("toggle-sign-in");

  toggleButton.addEventListener("click", () => {
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
  });
});
