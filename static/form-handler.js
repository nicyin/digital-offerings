const form = document.getElementById("submissionForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("userText").value;
    const imageFile = document.getElementById("imageInput").files[0];

    try {
        // Create new entry
        const newEntry = {
            text: text || null,
            timestamp: new Date().toISOString()
        };

        // Handle image if present
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                newEntry.imageBase64 = reader.result;
                await saveEntry(newEntry);
            };
            reader.readAsDataURL(imageFile);
        } else {
            newEntry.imageBase64 = null;
            await saveEntry(newEntry);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Error saving entry. Please try again.");
    }
});

async function saveEntry(entry) {
    try {
        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });

        const data = await response.json();
        if (data.success) {
            // Reset form and show success
            form.reset();
            document.getElementById("prompt-container").textContent = getRandomPrompt();
            alert("Entry saved successfully!");
        } else {
            throw new Error(data.error || 'Failed to save entry');
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Error saving entry. Please try again.");
    }
} 