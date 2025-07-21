const form = document.getElementById("submissionForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("userText").value;
  const imageFile = document.getElementById("imageInput").files[0];

  let imageBase64 = null;
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      imageBase64 = reader.result;

      try {
        const response = await fetch('https://digital-offerings-backend-dfc36e47d819.herokuapp.com/api/entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text || null,
            imageBase64: imageBase64,
            timestamp: new Date().toISOString()
          })
        });

        const data = await response.json();
        if (data.success) {
          form.reset();
          document.getElementById("prompt-container").textContent = getRandomPrompt();
          alert("Entry saved successfully!");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("Error saving entry. Please try again.");
      }
    };
    reader.readAsDataURL(imageFile);
  } else {
    // No image, just send text
    try {
      const response = await fetch('https://digital-offerings-backend-dfc36e47d819.herokuapp.com/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text || null,
          imageBase64: null,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (data.success) {
        form.reset();
        document.getElementById("prompt-container").textContent = getRandomPrompt();
        alert("Entry saved successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error saving entry. Please try again.");
    }
  }
}); 