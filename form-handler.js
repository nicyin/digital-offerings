const form = document.getElementById("submissionForm");

// Function to check localStorage size
function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (localStorage[key].length * 2) / 1024 / 1024; // Size in MB
        }
    }
    return total;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("userText").value;
    const imageFile = document.getElementById("imageInput").files[0];

    try {
        // Get existing data from localStorage
        let data = JSON.parse(localStorage.getItem('entries') || '{"entries": []}');
        
        // Create new entry
        const newEntry = {
            text: text || null,
            timestamp: new Date().toISOString()
        };

        // Handle image if present
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                newEntry.imageBase64 = reader.result;
                saveEntry();
            };
            reader.readAsDataURL(imageFile);
        } else {
            newEntry.imageBase64 = null;
            saveEntry();
        }

        function saveEntry() {
            // Add new entry to data
            data.entries.push(newEntry);
            
            // Check size before saving
            const entriesJson = JSON.stringify(data);
            const sizeInMB = (entriesJson.length * 2) / 1024 / 1024; // Size in MB
            const totalSize = getLocalStorageSize();
            
            if (totalSize + sizeInMB > 4.5) { // Setting a safe limit below the typical 5MB browser limit
                alert("Warning: Storage is nearly full. The oldest entries will be removed to make space.");
                // Remove oldest entries until we have space
                while ((entriesJson.length * 2) / 1024 / 1024 > 4.5 && data.entries.length > 1) {
                    data.entries.shift(); // Remove oldest entry
                }
            }

            try {
                // Save to localStorage
                localStorage.setItem('entries', JSON.stringify(data));
                
                // Trigger storage event for the current window
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'entries',
                    newValue: JSON.stringify(data),
                    url: window.location.href
                }));

                // Reset form and show success
                form.reset();
                document.getElementById("prompt-container").textContent = getRandomPrompt();
                alert("Entry saved successfully!");
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert("Storage is full. Please clear some entries before adding more.");
                } else {
                    throw e;
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Error saving entry. Please try again.");
    }
}); 