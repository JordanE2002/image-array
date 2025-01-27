// Object to track images added for each email (in-memory storage only)
const emailImageMap = {};

// Function to generate a random image URL with a unique query parameter to prevent caching
async function getRandomImage() {
    const url = `https://picsum.photos/620/320?random=${new Date().getTime()}`;
    return url;
}

// Function to render the image (called immediately on page load)
async function renderImage() {
    const imageUrl = await getRandomImage();

    // Update the image source with the new URL
    const existingImage = document.querySelector('#random-image');
    existingImage.src = imageUrl;

    // Reset the email input and button appearance
    resetInputAndButton();
}

// Function to add the current image to the collection
function addToCollection() {
    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value.trim(); // Get the value of the email input
    const addToCollectionButton = document.querySelector('.add-to-collection-button'); // Get the button

    // Check if the email field is empty
    if (email === "") {
        emailInput.style.border = "2px solid red"; // Add red border for empty email
        return; // Prevent adding to the collection if no email is provided
    }

    // Validate the email format with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        emailInput.style.border = "2px solid red"; // Add red border for invalid email
        return; // Prevent adding to the collection if the email is invalid
    }

    // Reset the border if the email is valid
    emailInput.style.border = "";

    const imageUrl = document.querySelector('#random-image').src;

    // Initialize the email in the map if it doesn't exist
    if (!emailImageMap[email]) {
        emailImageMap[email] = [];
    }

    // Check if the image already exists for this email
    if (emailImageMap[email].includes(imageUrl)) {
        addToCollectionButton.style.border = "2px solid red"; // Red border to the button
        addToCollectionButton.textContent = "Already Added"; // Change button text
        return; // Prevent duplicates
    }

    // Add the image URL to the array for this email
    emailImageMap[email].push(imageUrl);

    // Reset the button's appearance after adding the image
    addToCollectionButton.style.border = "";
    addToCollectionButton.textContent = "Add to Collection"; // Restore button text

    // Update the dropdown
    updateEmailDropdown();

    // Show the collection for the current email
    loadEmailCollection(email);
}

// Function to update the email dropdown
function updateEmailDropdown() {
    const dropdown = document.querySelector('#email-dropdown');
    dropdown.innerHTML = '<option value="">--Select Email--</option>'; // Reset the dropdown

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

    if (!email || !emailImageMap[email]) {
        return; // No email selected or no collection found
    }

    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = ""; // Clear existing collections

    const emailContainer = document.createElement('div');
    emailContainer.classList.add('email-collection-container');

    const emailTitle = document.createElement('h3');
    emailTitle.textContent = `Collection for: ${email}`;
    emailTitle.classList.add('email-title');

    const emailCollectionBox = document.createElement('div');
    emailCollectionBox.classList.add('collection-box');
    emailCollectionBox.id = `collection-box-${email}`;

    emailImageMap[email].forEach((url) => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        emailCollectionBox.appendChild(imgElement);
    });

    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(emailCollectionBox);
    mainCollectionContainer.appendChild(emailContainer);
}

// Function to delete all collections
function deleteAllCollections() {
    // Clear the email-image mapping object
    for (const email in emailImageMap) {
        delete emailImageMap[email];
    }

    // Reset the dropdown
    updateEmailDropdown();

    // Clear the main collection container
    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = "";

    // Optionally, show a confirmation message
    alert("All collections have been deleted!");
}

// Function to reset input and button appearance
function resetInputAndButton() {
    const emailInput = document.querySelector('#email-input');
    const addToCollectionButton = document.querySelector('.add-to-collection-button');

    // Reset the email input and button
    emailInput.style.border = ""; // Reset email input border
    addToCollectionButton.style.border = ""; // Reset button border
    addToCollectionButton.textContent = "Add to Collection"; // Reset button text
}

// Event listener for email dropdown change
document.querySelector('#email-dropdown').addEventListener('change', () => {
    // Reset the input and button when the email changes
    resetInputAndButton();
});

// Load email dropdown and collections on page load
document.addEventListener('DOMContentLoaded', () => {
    updateEmailDropdown();
    const dropdown = document.querySelector('#email-dropdown');
    dropdown.value = ""; // Reset dropdown selection
});



// Function to delete a specific email collection
function deleteSingleCollection(email) {
    if (!email || !emailImageMap[email]) return; // Ensure email exists

    // Confirm before deletion
    const confirmation = confirm(`Are you sure you want to delete the collection for ${email}?`);
    if (!confirmation) return;

    // Remove the email collection
    delete emailImageMap[email];

    // Update the dropdown and clear the main collection container
    updateEmailDropdown();
    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = "";

    // Optionally, show a confirmation message
    alert(`Collection for ${email} has been deleted!`);
}

// Updated function to load and display the collection for a selected email
function loadEmailCollection(selectedEmail = null) {
    const dropdown = document.querySelector('#email-dropdown');
    const email = selectedEmail || dropdown.value;

    if (!email || !emailImageMap[email]) {
        return; // No email selected or no collection found
    }

    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = ""; // Clear existing collections

    const emailContainer = document.createElement('div');
    emailContainer.classList.add('email-collection-container');

    const emailTitle = document.createElement('h3');
    emailTitle.textContent = `Collection for: ${email}`;
    emailTitle.classList.add('email-title');

    // Create a "Delete Collection" button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete Collection";
    deleteButton.classList.add('delete-single-button'); // Add styling class
    deleteButton.onclick = () => deleteSingleCollection(email);

    const emailCollectionBox = document.createElement('div');
    emailCollectionBox.classList.add('collection-box');
    emailCollectionBox.id = `collection-box-${email}`;

    emailImageMap[email].forEach((url) => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        emailCollectionBox.appendChild(imgElement);
    });

    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(deleteButton); // Add the delete button
    emailContainer.appendChild(emailCollectionBox);
    mainCollectionContainer.appendChild(emailContainer);
}
