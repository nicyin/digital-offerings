const form = document.getElementById("submissionForm");

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
      
      // Save to localStorage
      localStorage.setItem('entries', JSON.stringify(data));

      // Reset form and show success
      form.reset();
      document.getElementById("prompt-container").textContent = getRandomPrompt();
      alert("Entry saved successfully!");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error saving entry. Please try again.");
  }
}); 