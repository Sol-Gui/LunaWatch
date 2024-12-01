document.getElementById('sign-up-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
      alert('Email and password are required.');
      return;
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
      alert('Please enter a valid email.');
      return;
  }

  if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
  }

  try {
      const response = await fetch('/login/sign-up', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
          window.location.href = '/';
      } else {
          alert(result.error || 'An unknown error occurred');
      }
  } catch (error) {
      console.error('Request failed', error);
      alert('An error occurred while making the request');
  }
});
