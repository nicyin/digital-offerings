function getRandomPosition(entryDiv, container) {
    // Get the entries-container
    const entriesContainer = document.getElementById("entries-container");
    if (!entriesContainer) {
        console.error("Entries container not found");
        return { x: 0, y: 0, scale: 1 };
    }

    // Get container dimensions
    const containerRect = entriesContainer.getBoundingClientRect();
    
    // Get entry dimensions
    const entryRect = entryDiv.getBoundingClientRect();
    
    // Calculate available space
    const padding = 40; // Match container padding
    const maxWidth = containerRect.width - (padding * 2);
    const maxHeight = containerRect.height - (padding * 2);
    
    // Calculate scale if needed
    let scale = 1;
    if (entryRect.width > maxWidth || entryRect.height > maxHeight) {
        const scaleX = maxWidth / entryRect.width;
        const scaleY = maxHeight / entryRect.height;
        scale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% of max possible scale
    }
    
    // Calculate available positioning space
    const scaledWidth = entryRect.width * scale;
    const scaledHeight = entryRect.height * scale;
    const availableX = maxWidth - scaledWidth;
    const availableY = maxHeight - scaledHeight;
    
    // Generate random position within available space
    const x = (Math.random() * availableX) - (maxWidth / 2) + (scaledWidth / 2);
    const y = (Math.random() * availableY) - (maxHeight / 2) + (scaledHeight / 2);
    
    // Log positioning data
    console.log("Positioning:", {
        container: { width: containerRect.width, height: containerRect.height },
        entry: { width: entryRect.width, height: entryRect.height },
        scaled: { width: scaledWidth, height: scaledHeight },
        available: { x: availableX, y: availableY },
        position: { x, y, scale }
    });

    return {
        x: Math.max(Math.min(x, availableX/2), -availableX/2),
        y: Math.max(Math.min(y, availableY/2), -availableY/2),
        scale: scale
    };
}

function startOpacityAnimation(entryDiv) {
    function updateOpacity() {
        entryDiv.style.opacity = (Math.random() * 0.6 + 0.2).toString();
        setTimeout(updateOpacity, 800 + Math.random() * 700);
    }
    updateOpacity();
}

let entryStates = new Map();

function createEntryElement(entry, container, position = null) {
    const entryDiv = document.createElement("div");
    entryDiv.className = "entry";
    entryDiv.setAttribute("data-id", entry.id);
    
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
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        
        imgWrapper.appendChild(img);
        entryDiv.appendChild(imgWrapper);
    }
    
    const timestamp = document.createElement("small");
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    timestamp.className = "entry-timestamp";
    entryDiv.appendChild(timestamp);
    
    // Add to DOM with initial opacity of 0
    entryDiv.style.opacity = "0";
    container.appendChild(entryDiv);
    
    // For images, wait for load before positioning
    const images = entryDiv.getElementsByTagName("img");
    if (images.length > 0) {
        images[0].onload = () => {
            positionEntry(entryDiv, container, position);
        };
    } else {
        // For text-only entries, position immediately
        positionEntry(entryDiv, container, position);
    }
    
    return entryDiv;
}

function positionEntry(entryDiv, container, position = null) {
    // Disable transitions temporarily
    entryDiv.style.transition = "none";
    
    // Get position
    const pos = position || getRandomPosition(entryDiv, container);
    
    // Apply position
    entryDiv.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`;
    entryStates.set(Number(entryDiv.getAttribute("data-id")), pos);
    
    // Force reflow
    entryDiv.offsetHeight;
    
    // Restore transitions
    entryDiv.style.transition = "";
    
    // Fade in
    requestAnimationFrame(() => {
        entryDiv.style.opacity = "1";
        setTimeout(() => {
            startOpacityAnimation(entryDiv);
        }, 1000);
    });
}

async function loadEntries() {
    try {
        const response = await fetch("/api/entries");
        const data = await response.json();
        const container = document.getElementById("entries-container");
        
        const currentEntries = new Set(
            Array.from(document.querySelectorAll(".entry"))
                .map(div => Number(div.getAttribute("data-id")))
        );
        
        data.entries.forEach(entry => {
            const id = Number(entry.id);
            if (!currentEntries.has(id)) {
                console.log("Adding new entry:", id);
                createEntryElement(entry, container);
            }
        });
        
    } catch (error) {
        console.error("Error loading entries:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadEntries();
    setInterval(loadEntries, 5000);
    
    // Update positions on resize with debounce
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const container = document.getElementById("entries-container");
            document.querySelectorAll(".entry").forEach(entryDiv => {
                const pos = getRandomPosition(entryDiv, container);
                entryDiv.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`;
                entryStates.set(Number(entryDiv.getAttribute("data-id")), pos);
            });
        }, 100);
    });
});
