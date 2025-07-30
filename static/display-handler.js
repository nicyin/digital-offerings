function loadEntries() {
    try {
        fetch("/api/entries")
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("entries-container");
                
                // Clear container
                container.innerHTML = "";
                
                // Display entries in reverse chronological order
                data.entries.forEach(entry => {
                    const entryDiv = document.createElement("div");
                    entryDiv.className = "entry";
                    
                    if (entry.text) {
                        const textP = document.createElement("p");
                        textP.textContent = entry.text;
                        entryDiv.appendChild(textP);
                    }
                    
                    if (entry.imageBase64) {
                        const img = document.createElement("img");
                        img.src = entry.imageBase64;
                        img.alt = "Uploaded image";
                        entryDiv.appendChild(img);
                    }
                    
                    const timestamp = document.createElement("small");
                    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
                    entryDiv.appendChild(timestamp);
                    
                    container.appendChild(entryDiv);
                });
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
});
