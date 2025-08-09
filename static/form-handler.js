$(document).ready(function() {
    const $form = $("#submissionForm");
    const $imageInput = $("#imageInput");
    
    // Add image preview container to the form
    const $previewContainer = $("<div>")
        .addClass("image-preview-container")
        .hide();
    $form.find(".input-wrapper").after($previewContainer);
    
    // Handle image selection and preview
    $imageInput.on("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                $previewContainer
                    .show()
                    .html(`
                        <div class="preview-wrapper">
                            <img src="${reader.result}" alt="Preview" class="image-preview">
                            <button type="button" class="remove-image" aria-label="Remove image">×</button>
                        </div>
                    `);
    
                // Handle remove button click
                $previewContainer.find(".remove-image").on("click", function() {
                    $imageInput.val("");
                    $previewContainer
                        .hide()
                        .empty();
                });
            };
            reader.readAsDataURL(file);
        }
    });
    
    $form.on("submit", async function(e) {
        e.preventDefault();
        const text = $("#userText").val();
        const imageFile = $imageInput[0].files[0];
    
        try {
            // Create new entry
            const newEntry = {
                text: text || null,
                timestamp: new Date().toISOString()
            };
    
            // Handle image if present
            if (imageFile) {
                const reader = new FileReader();
                reader.onloadend = async function() {
                    newEntry.imageBase64 = reader.result;
                    await saveEntry(newEntry);
                };
                reader.readAsDataURL(imageFile);
            } else {
                newEntry.imageBase64 = null;
                await saveEntry(newEntry);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error saving entry. Please try again.");
        }
    });
    
    async function saveEntry(entry) {
        try {
            const { success, error } = await $.ajax({
                url: "/api/entries",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(entry)
            });
    
            if (success) {
                // Reset form and show success
                $form[0].reset();
                $previewContainer
                    .hide()
                    .empty();
                $("#prompt-container").text(getRandomPrompt());
                alert("digital offering accepted");
            } else {
                throw new Error(error || "offering failed :(");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error saving entry. Please try again.");
        }
    }
});