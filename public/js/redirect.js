document.querySelectorAll('.sign-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

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

        const isSignUp = form.id === 'sign-up-form';

        try {
            const response = await fetch(`/login/${isSignUp ? 'sign-up' : 'sign-in'}`, {
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
});