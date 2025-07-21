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
    
    // Display initial random prompt
    promptContainer.textContent = getRandomPrompt();

});