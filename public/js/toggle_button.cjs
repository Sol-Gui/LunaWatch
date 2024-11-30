let method = 1

document.addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("text");
  const toggleButton = document.getElementById("toggle-button");
  const signUpForm = document.getElementById("toggle-sign-up");
  const signInForm = document.getElementById("toggle-sign-in");

  toggleButton.addEventListener("click", () => {
      signUpForm.classList.toggle("hidden");
      signInForm.classList.toggle("hidden");

      if (signUpForm.classList.contains("hidden")) {
        toggleButton.textContent = "Sign Up";
        text.textContent = "Register yourself for more useful tools!";
      } else {
        toggleButton.textContent = "Sign in";
        text.textContent = "Login with your credentials for full access";
      }
  });
});
