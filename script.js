// Function to generate a random dog image URL with a unique query parameter to prevent caching
async function getRandomDog() {
    const url = `https://picsum.photos/620/320?random=${new Date().getTime()}`;
    return url;
}

// Function to render the dog image (called immediately on page load)
async function renderDogs() {
    const dogImageUrl = await getRandomDog();

    // Update the image source with the new URL
    const existingImage = document.querySelector('#dog-image');
    existingImage.src = dogImageUrl;
}
