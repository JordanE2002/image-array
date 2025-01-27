// Object to track images added for each email (in-memory storage only)
const emailImageMap = {};

// ---------------------------------------------------------
// Image Generation & UI Rendering
// ---------------------------------------------------------

// Function to generate a random image URL with a unique query parameter to prevent caching
async function getRandomImage() {
    const url = `https://picsum.photos/620/320?random=${new Date().getTime()}`;
    return url;
}

// Function to render the image (called immediately on page load)
async function renderImage() {
    const imageUrl = await getRandomImage();
    const existingImage = document.querySelector('#random-image');
    existingImage.src = imageUrl;
    resetInputAndButton();  // Reset input and button appearance
}

// ---------------------------------------------------------
// Collection Management
// ---------------------------------------------------------

// Function to add the current image to the collection
function addToCollection() {
    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value.trim();
    const addToCollectionButton = document.querySelector('.add-to-collection-button');

    // Validate email input
    if (!validateEmailInput(email, emailInput, addToCollectionButton)) return;

    const imageUrl = document.querySelector('#random-image').src;

    // Initialize the email in the map if it doesn't exist
    if (!emailImageMap[email]) emailImageMap[email] = [];

    // Prevent duplicates
    if (emailImageMap[email].includes(imageUrl)) {
        showDuplicateMessage(addToCollectionButton);
        return;
    }

    // Add the image to the collection and update UI
    emailImageMap[email].push(imageUrl);
    resetAddToCollectionButton(addToCollectionButton);

    // Update dropdown and display the email's collection
    updateEmailDropdown();
    loadEmailCollection(email);
}

// Function to validate the email input
function validateEmailInput(email, emailInput, addToCollectionButton) {
    // Check if the email field is empty
    if (email === "") {
        emailInput.style.border = "2px solid red";
        return false;
    }

    // Validate email format with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        emailInput.style.border = "2px solid red";
        return false;
    }

    // Reset the border if the email is valid
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

// ---------------------------------------------------------
// Dropdown and Collection Display
// ---------------------------------------------------------

// Function to update the email dropdown
function updateEmailDropdown() {
    const dropdown = document.querySelector('#email-dropdown');
    dropdown.innerHTML = '<option value="">--Select Email--</option>'; // Reset dropdown

    // Add email options to the dropdown
    for (const email in emailImageMap) {
        const option = document.createElement('option');
        option.value = email;
        option.textContent = email;
        dropdown.appendChild(option);
    }
}

// Function to load and display the collection for a selected email
function loadEmailCollection(selectedEmail = null) {
    const dropdown = document.querySelector('#email-dropdown');
    const email = selectedEmail || dropdown.value;

    if (!email || !emailImageMap[email]) return;

    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = "";  // Clear existing collections

    // Create collection elements
    const emailContainer = createEmailCollectionContainer(email);
    mainCollectionContainer.appendChild(emailContainer);
}

// Create HTML elements for the email's collection
function createEmailCollectionContainer(email) {
    const emailContainer = document.createElement('div');
    emailContainer.classList.add('email-collection-container');

    const emailTitle = document.createElement('h3');
    emailTitle.textContent = `Collection for: ${email}`;
    emailTitle.classList.add('email-title');

    const emailCollectionBox = document.createElement('div');
    emailCollectionBox.classList.add('collection-box');
    emailCollectionBox.id = `collection-box-${email}`;

    emailImageMap[email].forEach(url => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        emailCollectionBox.appendChild(imgElement);
    });

    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(emailCollectionBox);
    return emailContainer;
}

// ---------------------------------------------------------
// Collection Deletion
// ---------------------------------------------------------

// Function to delete the collection for the email in the input box
function deleteCollection() {
    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value.trim();

    if (!email || !emailImageMap[email]) {
        alert("No collection found for the provided email.");
        return;
    }

    // Directly delete the collection without asking for confirmation
    delete emailImageMap[email];
    updateEmailDropdown();
    clearCollectionsAndInput();

    // Change the label text and style temporarily
    const deleteLabel = document.querySelector('.delete-button-container label');
    deleteLabel.textContent = `Collection for ${email} has been deleted!`;
    deleteLabel.style.color = "green"; // Add color change for feedback

    // Reset label text and color after 5 seconds
    setTimeout(() => {
        deleteLabel.textContent = "Delete Collection in email box";  // Original label text
        deleteLabel.style.color = ""; // Reset color
    }, 5000);  // 5 seconds timeout
}

// Function to delete all collections
function deleteAllCollections() {
    // Directly delete all collections without asking for confirmation
    for (const email in emailImageMap) {
        delete emailImageMap[email];
    }

    updateEmailDropdown();
    clearCollectionsAndInput();

    // Change the label text and style temporarily
    const deleteAllLabel = document.querySelector('.delete-all-button-container label');
    deleteAllLabel.textContent = "All collections have been deleted!";
    deleteAllLabel.style.color = "green"; // Add color change for feedback

    // Reset label text and color after 5 seconds
    setTimeout(() => {
        deleteAllLabel.textContent = "Delete All Collections";  // Original label text
        deleteAllLabel.style.color = ""; // Reset color
    }, 5000);  // 5 seconds timeout
}

// Helper function to clear collections and reset input
function clearCollectionsAndInput() {
    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = "";
    const emailInput = document.querySelector('#email-input');
    emailInput.value = "";
}

// ---------------------------------------------------------
// UI Reset Functions
// ---------------------------------------------------------

// Function to reset input and button appearance
function resetInputAndButton() {
    const emailInput = document.querySelector('#email-input');
    const addToCollectionButton = document.querySelector('.add-to-collection-button');

    emailInput.style.border = "";  // Reset email input border
    addToCollectionButton.style.border = "";  // Reset button border
    addToCollectionButton.textContent = "Add to Collection";  // Reset button text
}

// ---------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------

// Event listener for email dropdown change
document.querySelector('#email-dropdown').addEventListener('change', () => {
    resetInputAndButton();
});

// Load email dropdown and collections on page load
document.addEventListener('DOMContentLoaded', () => {
    updateEmailDropdown();
    const dropdown = document.querySelector('#email-dropdown');
    dropdown.value = "";  // Reset dropdown selection
});
