// Object to track images added for each email
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
}

// Function to add the current image to the collection
function addToCollection() {
    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value.trim(); // Get the value of the email input

    // Check if the email field is empty
    if (email === "") {
        alert("Please enter your email before adding the image to your collection.");
        return; // Prevent adding to the collection if no email is provided
    }

    // Validate the email format with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return; // Prevent adding to the collection if the email is invalid
    }

    const imageUrl = document.querySelector('#random-image').src;

    // Initialize the email in the map if it doesn't exist
    if (!emailImageMap[email]) {
        emailImageMap[email] = new Set();
    }

    // Check if the image already exists for this email
    if (emailImageMap[email].has(imageUrl)) {
        alert("You have already added this image to your collection for the provided email.");
        return; // Prevent duplicates
    }

    // Add the image URL to the Set for this email
    emailImageMap[email].add(imageUrl);

    // Clear all existing collections except for the current email
    const mainCollectionContainer = document.querySelector('#main-collection-container');
    mainCollectionContainer.innerHTML = "";

    // Create a new collection container for this email
    const emailContainer = document.createElement('div');
    emailContainer.classList.add('email-collection-container');

    // Add a title for the email
    const emailTitle = document.createElement('h3');
    emailTitle.textContent = `Collection for: ${email}`;
    emailTitle.classList.add('email-title');

    // Create the collection box for this email
    const emailCollectionBox = document.createElement('div');
    emailCollectionBox.classList.add('collection-box');
    emailCollectionBox.id = `collection-box-${email}`;

    // Add images from the email's collection
    emailImageMap[email].forEach((url) => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        emailCollectionBox.appendChild(imgElement);
    });

    // Append the email title and the collection box to the container
    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(emailCollectionBox);

    // Append the email container to the main collection container
    mainCollectionContainer.appendChild(emailContainer);


}
