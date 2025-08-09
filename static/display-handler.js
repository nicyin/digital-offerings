function getRandomPosition($container) {
    const containerWidth = $container.width();
    const containerHeight = $container.height();
    
    const maxX = containerWidth - 300;
    const maxY = containerHeight - 200;
    
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
        
        // Mark existing entries as old
        $container.find('.entry').addClass('old-entry');
        
        // Add new entries
        entries.forEach((entry, index) => {
            const $entryDiv = $("<div>")
                .addClass("entry new-entry")
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
            }, 800 + (index * 400));
        });

        // Fade out and remove old entries with staggered timing
        $container.find('.old-entry').each(function(index) {
            const $oldEntry = $(this);
            setTimeout(() => {
                $oldEntry.addClass('fade-out');
                
                // Remove after fade out completes
                setTimeout(() => {
                    $oldEntry.remove();
                }, 1200); // Match this with CSS transition duration
            }, 600 + (index * 200)); // Stagger the fade out
        });

    } catch (error) {
        console.error("Error loading entries:", error);
    }
}

// Load entries when document is ready
$(document).ready(function() {
    loadEntries();
    // Refresh entries every few seconds
    setInterval(loadEntries, 10000);
});