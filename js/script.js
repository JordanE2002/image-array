// Object to track images added for each email 
const emailImageMap = {};

// Function to get a fixed image URL from Picsum
async function getFixedRandomImage() {
    try {
        const response = await fetch('https://picsum.photos/620/320');
        return response.url; // Store the fixed image URL
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

// Function to render a fixed random image
// Function to render a fixed random image on page load and button click
async function renderImage() {
    const existingImage = document.querySelector('#random-image');

    try {
        const imageUrl = await getFixedRandomImage();
        if (!imageUrl) return;

        existingImage.src = imageUrl;
        existingImage.dataset.fixedUrl = imageUrl; // Ensure fixed URL is set

        resetInputAndButton();
    } catch (error) {
        console.error("Error rendering image:", error);
    }
}

// Ensure the first image is properly set on page load
document.addEventListener('DOMContentLoaded', async () => {
    await renderImage(); // Load first image correctly
    updateEmailDropdown();
});
// Function to add the current image to the collection
function addToCollection() {
    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value.trim();
    const addToCollectionButton = document.querySelector('.add-to-collection-button');

    if (!validateEmailInput(email, emailInput, addToCollectionButton)) return;

    const imageElement = document.querySelector('#random-image');
    const imageUrl = imageElement.dataset.fixedUrl; // Retrieve fixed URL

    if (!imageUrl) {
        console.error('Image URL not found!');
        return;
    }

    if (!emailImageMap[email]) emailImageMap[email] = [];

    if (emailImageMap[email].includes(imageUrl)) {
        showDuplicateMessage(addToCollectionButton);
        return;
    }

    emailImageMap[email].push(imageUrl);
    resetAddToCollectionButton(addToCollectionButton);

    updateEmailDropdown(email);
}

// Function to update the email dropdown
function updateEmailDropdown(selectedEmail = null) {
    const dropdown = document.querySelector('#email-dropdown');
    dropdown.innerHTML = '<option value="">--Select Email--</option>'; 

    for (const email in emailImageMap) {
        const option = document.createElement('option');
        option.value = email;
        option.textContent = email;

        if (email === selectedEmail) {
            option.selected = true;
        }

        dropdown.appendChild(option);
    }

    if (selectedEmail) {
        loadEmailCollection(selectedEmail);
    }
}

// Function to load and display the collection for a selected email
function loadEmailCollection() {
    const dropdown = document.querySelector('#email-dropdown');
    const email = dropdown.value;

    if (!email || !emailImageMap[email]) return;

    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = ""; 

    const emailContainer = createEmailCollectionContainer(email);
    mainCollectionContainer.appendChild(emailContainer);
}

// Create collection elements
function createEmailCollectionContainer(email) {
    const emailContainer = document.createElement('div');
    emailContainer.classList.add('email-collection-container');

    const emailTitle = document.createElement('h3');
    emailTitle.textContent = `Collection for: ${email}`;
    emailTitle.classList.add('email-title');

    const emailCollectionBox = document.createElement('div');
    emailCollectionBox.classList.add('collection-box');

    emailImageMap[email].forEach(url => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        emailCollectionBox.appendChild(imgElement);
    });

    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(emailCollectionBox);
    return emailContainer;
}

// Function to delete all collections
function deleteAllCollections() {
    for (const email in emailImageMap) {
        delete emailImageMap[email];
    }

    updateEmailDropdown();
    clearCollectionsAndInput();

    const deleteAllLabel = document.querySelector('.delete-all-button-container label');
    deleteAllLabel.textContent = "All collections have been deleted!";

    setTimeout(() => {
        deleteAllLabel.textContent = "Delete All Collections";  
    }, 5000);
}

// Function to delete selected email's collection
function deleteCollection() {
    const dropdown = document.querySelector('#email-dropdown');
    const email = dropdown.value;
    const deleteLabel = document.querySelector('.delete-button-container label');

    if (!email || !emailImageMap[email]) {
        deleteLabel.textContent = "No email found!";
        setTimeout(() => {
            deleteLabel.textContent = "Delete Collection in dropdown"; 
        }, 5000); 
        return; 
    }

    delete emailImageMap[email];
    updateEmailDropdown();
    clearCollectionsAndInput();

    deleteLabel.textContent = `Collection for ${email} has been deleted!`;

    setTimeout(() => {
        deleteLabel.textContent = "Delete Collection in dropdown"; 
    }, 5000);
}

// Helper function to clear collections and reset input
function clearCollectionsAndInput() {
    document.querySelector('#main-collection-container').innerHTML = "";
    document.querySelector('#email-input').value = "";
}

// Function to reset input and button appearance
function resetInputAndButton() {
    const emailInput = document.querySelector('#email-input');
    const addToCollectionButton = document.querySelector('.add-to-collection-button');

    emailInput.style.border = "";  
    addToCollectionButton.style.border = "";  
    addToCollectionButton.textContent = "Add to Collection";  
}

// Validate email format
function validateEmailInput(email, emailInput, addToCollectionButton) {
    if (email === "") {
        emailInput.style.border = "2px solid red";
        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        emailInput.style.border = "2px solid red";
        return false;
    }

    emailInput.style.border = "";
    return true;
}

// Show message if image is already added
function showDuplicateMessage(addToCollectionButton) {
    addToCollectionButton.style.border = "2px solid red";
    addToCollectionButton.textContent = "Already Added";
}

// Reset the appearance of the Add to Collection button
function resetAddToCollectionButton(addToCollectionButton) {
    addToCollectionButton.style.border = "";
    addToCollectionButton.textContent = "Add to Collection";
}

// Event listener for email dropdown change
document.querySelector('#email-dropdown').addEventListener('change', function () {
    const selectedEmail = this.value; 
    const emailInput = document.querySelector('#email-input');
    
    if (selectedEmail) {
        emailInput.value = selectedEmail; 
    }

    resetInputAndButton();
    loadEmailCollection();
});

// Load email dropdown and collections on page load
document.addEventListener('DOMContentLoaded', () => {
    updateEmailDropdown();
    document.querySelector('#email-dropdown').value = "";  
});
