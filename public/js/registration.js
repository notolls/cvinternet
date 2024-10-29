document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(registrationForm);
        const username = formData.get('username');
        const password = formData.get('password');

        // Perform registration logic (e.g., send data to the server)
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                alert('Registration successful!');
                // Redirect the user to the login page or perform other actions
                window.location.href = '/login'; // Assuming you have a login page
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
