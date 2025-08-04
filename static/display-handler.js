function getRandomPosition() {
    return {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        scale: Math.random() * 0.3 + 0.85
    };
}

function startOpacityAnimation(entryDiv) {
    function updateOpacity() {
        entryDiv.style.opacity = (Math.random() * 0.6 + 0.2).toString();
        setTimeout(updateOpacity, 1000 + Math.random() * 1000);
    }
    updateOpacity();
}




async function loadEntries() {
    try {
        // Fade out existing entries first

        
        const response = await fetch("/api/entries");
        const data = await response.json();
        const container = document.getElementById("entries-container");
        
        // Clear container and wait a moment before starting new entries
        container.innerHTML = "";
        await new Promise(resolve => setTimeout(resolve, 500));
        
        data.entries.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "entry";
            
            // Set initial random position
            const pos = getRandomPosition();
            entryDiv.style.transform = `translate(${pos.x}%, ${pos.y}%) scale(${pos.scale})`;
            
            // Ensure opacity starts at 0
            entryDiv.style.opacity = "0";
            
            if (entry.text) {
                const textP = document.createElement("p");
                textP.textContent = entry.text;
                textP.className = "entry-text";
                entryDiv.appendChild(textP);
            }
            
            if (entry.imageBase64) {
                const imgWrapper = document.createElement("div");
                imgWrapper.className = "image-wrapper";
                
                const img = document.createElement("img");
                img.src = entry.imageBase64;
                img.alt = "Uploaded image";
                img.className = "entry-image";
                
                imgWrapper.appendChild(img);
                entryDiv.appendChild(imgWrapper);
            }
            
            const timestamp = document.createElement("small");
            timestamp.textContent = new Date(entry.timestamp).toLocaleString();
            timestamp.className = "entry-timestamp";
            entryDiv.appendChild(timestamp);
            
            // Add to container but keep invisible
            container.appendChild(entryDiv);
            
            // Force a reflow before starting the animation
            entryDiv.offsetHeight;
            
            // Stagger the initial fade in with easing
            setTimeout(() => {
                requestAnimationFrame(() => {
                    // Add transition class for smoother fade in
                    entryDiv.classList.add("fade-in");
                    entryDiv.style.opacity = "1";
                    
                    // Start the continuous opacity changes after initial fade
                    setTimeout(() => {
                        startOpacityAnimation(entryDiv);
                    }, 2000);
                });
            }, 500 + (index * 300)); // Add base delay plus stagger
        });
    } catch (error) {
        console.error("Error loading entries:", error);
    }
}

// Load entries immediately
document.addEventListener("DOMContentLoaded", () => {
    loadEntries();
    // Refresh entries every few seconds
    setInterval(loadEntries, 5000);
})