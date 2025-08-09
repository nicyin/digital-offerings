function getRandomPosition($container) {
    // Get container dimensions
    const containerWidth = $container.width();
    const containerHeight = $container.height();
    
    // Calculate maximum positions while keeping entries visible
    const maxX = containerWidth - 300; // 300px is approximate entry width
    const maxY = containerHeight - 200; // 200px is approximate entry height
    
    return {
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        scale: Math.random() * 0.2 + 0.9,
        rotation: Math.random() * 20 - 10
    };
}

function startOpacityAnimation($entryDiv) {
    function updateOpacity() {
        $entryDiv.css('opacity', (Math.random() * 0.4 + 0.6).toString());
        setTimeout(updateOpacity, 1000 + Math.random() * 1000);
    }
    updateOpacity();
}

async function loadEntries() {
    try {
        const $container = $("#entries-container");
        
        // Get entries from server
        const { entries } = await $.getJSON("/api/entries");
        
        // Clear container and wait a moment before starting new entries
        $container.empty();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        entries.forEach((entry, index) => {
            const $entryDiv = $("<div>")
                .addClass("entry")
                .css({
                    opacity: 0
                });
            
            if (entry.text) {
                $("<p>")
                    .addClass("entry-text")
                    .text(entry.text)
                    .appendTo($entryDiv);
            }
            
            if (entry.imageBase64) {
                const $imgWrapper = $("<div>").addClass("image-wrapper");
                $("<img>")
                    .attr({
                        src: entry.imageBase64,
                        alt: "Uploaded image"
                    })
                    .addClass("entry-image")
                    .appendTo($imgWrapper);
                
                $imgWrapper.appendTo($entryDiv);
            }
            
            $("<small>")
                .addClass("entry-timestamp")
                .text(new Date(entry.timestamp).toLocaleString())
                .appendTo($entryDiv);
            
            // Add to container
            $container.append($entryDiv);
            
            // Get random position within container bounds
            const pos = getRandomPosition($container);
            $entryDiv.css({
                left: pos.x + 'px',
                top: pos.y + 'px',
                transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`
            });
            
            // Force a reflow before starting the animation
            $entryDiv[0].offsetHeight;
            
            // Stagger the initial fade in
            setTimeout(() => {
                requestAnimationFrame(() => {
                    // Add transition class for smoother fade in
                    $entryDiv
                        .addClass("fade-in")
                        .css('opacity', 1);
                    
                    // Start the continuous opacity changes after initial fade
                    setTimeout(() => {
                        startOpacityAnimation($entryDiv);
                    }, 2000);
                });
            }, 500 + (index * 300));
        });
    } catch (error) {
        console.error("Error loading entries:", error);
    }
}

// Load entries when document is ready
$(document).ready(function() {
    loadEntries();
    // Refresh entries every few seconds
    setInterval(loadEntries, 5000);
});