function loadEntries() {
    try {
        fetch("/api/entries")
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("entries-container");
                container.innerHTML = "";
                
                data.entries.forEach(entry => {
                    const entryDiv = document.createElement("div");
                    entryDiv.className = "entry"; // base class

                    if (entry.text) {
                        const textP = document.createElement("p");
                        textP.textContent = entry.text;
                        textP.className = "entry-text"; // specific class for text
                        
                        // You could add additional classes based on content
                        if (entry.text.length < 50) {
                            textP.classList.add("entry-text-short");
                        } else {
                            textP.classList.add("entry-text-long");
                        }
                        
                        entryDiv.appendChild(textP);
                        entryDiv.classList.add("entry-type-text"); // mark this entry as text-containing
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
                        entryDiv.classList.add("entry-type-image"); // mark this entry as image-containing
                    }
                    
                    const timestamp = document.createElement("small");
                    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
                    timestamp.className = "entry-timestamp";
                    entryDiv.appendChild(timestamp);
                    
                    // Add animation class
                    entryDiv.classList.add("entry-fade-in");
                    
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
