// Function to fetch uploaded files from the server
async function fetchFiles() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token is missing');
        }
        const response = await fetch('/uploads' , {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.files;
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

// Function to display uploaded files
async function displayFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear existing list

    const files = await fetchFiles();
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        fileList.appendChild(listItem);
    });
}

// Call displayFiles() when the page loads to show the list of uploaded files
window.onload = function() {
    displayFiles();
};
