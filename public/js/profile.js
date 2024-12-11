let editName = false



document.getElementById('edit-password').addEventListener('submit', async function(event) {
  try {
    event.preventDefault();

    const oldPassword = document.getElementById('old-password').value
    const newPassword = document.getElementById('new-password').value;

    const response = await fetch(`/profile/edit-password`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword })
    })
    if (response.ok) {
      window.location.href = '/profile';
    } else {
      alert("Failed to edit password")
    }
  } catch (err) {
    throw err;
  }
});

document.getElementById('delete-account').addEventListener('submit', async function(event) {
  try {
    event.preventDefault();

    const password = document.getElementById('password').value

    const response = await fetch(`/profile/delete-account`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password })
    })
    if (response.ok) {
      window.location.href = '/';
    } else {
      alert("Failed to edit password")
    }
  } catch (err) {
    throw err;
  }
});

document.getElementById('edit-username').addEventListener('submit', async function(event) {
  event.preventDefault()

  const newUsername = document.getElementById('new-username').value;

  if (!newUsername) {
    alert("Please enter a valid username.");
    return;
  } else if (newUsername.length < 3) {
    alert("new username is too short");
    return;
  } else if (newUsername.length > 12) {
    alert("new username is too long");
    return;
  }

  try {
    const response = await fetch(`/profile/change-username`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername })
    })
    if (response.ok) {
      window.location.href = '/profile';
    } else {
      alert("Failed to edit password")
    }
  } catch (err) {
    throw err;
  }

});