document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        // Perform login logic (send data to the server)
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            window.location.href = '/dashboard';
            // if (response.ok) {
            //     // Redirect the user to the dashboard or other page upon successful login
            //     window.location.href = '/register';
            // } else {
            //     alert('Invalid username or password. Please try again.');
            // }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
