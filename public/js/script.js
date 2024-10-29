document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const contentTextarea = document.getElementById('contentTextarea');
    const saveButton = document.getElementById('saveButton');

    // fetch('/admin/edit-index')
    // .then(response => response.text())
    // .then(data => {
    //     htmlContentTextarea.value = data;
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     alert('An error occurred while fetching index.html');
    // });

    saveButton.addEventListener('click', function () {
        const htmlContent = htmlContentTextarea.value;

        // Send the modified content to the server for saving
        fetch('/admin/save-index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ htmlContent })
        })
        .then(response => {
            if (response.ok) {
                alert('Index.html updated successfully');
            } else {
                alert('Failed to update index.html');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating index.html');
        });
    });
    loginButton.addEventListener('click', function () {
        const username = prompt('Enter your username:');
        const password = prompt('Enter your password:');
        saveUsername(username);
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                onLogin(username);
                response.json().then(data => {
                    const { token } = data;
                    localStorage.setItem('token', data.token);
                    window.location.href = '/dashboard'; 
                });
            } else {
                alert('Login failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });

    registerButton.addEventListener('click', function () {
        // Handle register button click...
        window.location.href = '/register'
    });

    // function fetchIndexHtml() {
    //     const token = localStorage.getItem('token');
    //     fetch('/index', {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //     .then(response => response.text())
    //     .then(data => {
    //         contentTextarea.value = data;
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         alert('An error occurred while fetching index.html');
    //     });
    // }

    function modifyIndexHtml(htmlContent) {
        const token = localStorage.getItem('token');
        fetch('/modify-index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ html: htmlContent })
        })
        .then(response => {
            if (response.ok) {
                alert('Index.html modified successfully');
            } else {
                alert('Failed to modify index.html');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while modifying index.html');
        });
    }

    // // Assuming there's a button to submit changes
    // submitButton.addEventListener('click', function () {
    //     const modifiedHtml = contentTextarea.value;
    //     modifyIndexHtml(modifiedHtml);
    // });
});

// slides
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach((slide) => {
        slide.style.display = 'none';
    });
    slideIndex += n;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }
    slides[slideIndex].style.display = 'block';
}

function plusSlides(n) {
    showSlide(n);
}

showSlide(0);

// mousemoving

document.addEventListener('mousemove', parallax);

function parallax(e) {
    const bg = document.querySelector('.background');
    const speed = 10; // Adjust the speed of parallax effect

    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;

    bg.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

// Function to save username in localStorage
function saveUsername(username) {
    localStorage.setItem('username', username);
}

// Function to retrieve username from localStorage
function getUsername() {
    return localStorage.getItem('username');
}

// Function to display the username
function displayUsername() {
    const username = getUsername();
    if (username) {
        document.getElementById('username').innerText = 'Welcome, ' + username + '!';
    } else {
        document.getElementById('username').innerText = 'Welcome!';
    }
}

// Assume this function is called when the user is logged in successfully
function onLogin(username) {
    saveUsername(username); // Save username in localStorage
    displayUsername(); // Display the username
}

// Call displayUsername() when the page loads to show the username if it's already saved
window.onload = function() {
    displayUsername();
};