// Array of prompts to cycle through
const prompts = [
    "your favorite emoji",
    "a scandalous screenshot",
    "the last meme you saved",
    "something you googled",
    "a screenshot of your search history",
    "an open browser tab",
    "the last text you sent",
    "a meaningful text received",
    "your lock screen",
    "a funny screenshot",
    "something you wanted to remember",
    "a note"
];

// Function to get a random prompt
function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

// Initialize when page loads
window.addEventListener('load', () => {
    const promptContainer = document.getElementById('prompt-container');
    const form = document.getElementById('offering-form');
    const textInput = document.getElementById('text-input');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const sendButton = document.getElementById('send-button');

    // Display initial random prompt
    promptContainer.textContent = getRandomPrompt();

    // Handle image upload and preview
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            // Create or get existing preview image
            let img = imagePreview.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                imagePreview.appendChild(img);
            }

            reader.onload = (e) => {
                img.src = e.target.result;
                img.style.display = 'block';
            };

            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        const text = textInput.value.trim();
        const hasImage = imagePreview.querySelector('img') !== null;

        if (text || hasImage) {
            console.log('Offering submitted:', {
                text: text,
                hasImage: hasImage
            });

            // Clear form and show new prompt
            textInput.value = '';
            imagePreview.innerHTML = '';
            promptContainer.textContent = getRandomPrompt();
        }
    });
});