document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const sizeSlider = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const colorPicker = document.getElementById('color');
    const bgColorPicker = document.getElementById('bgcolor');
    const patternSelect = document.getElementById('pattern');
    const rotationSlider = document.getElementById('rotation');
    const rotationValue = document.getElementById('rotation-value');
    const sparkleCheckbox = document.getElementById('sparkle');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('diamond-canvas');
    const ctx = canvas.getContext('2d');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Define diamondSize globally for use in the drawing functions
    let diamondSize;

    // Update value displays when sliders change
    sizeSlider.addEventListener('input', () => {
        sizeValue.textContent = sizeSlider.value;
    });

    rotationSlider.addEventListener('input', () => {
        rotationValue.textContent = `${rotationSlider.value}°`;
    });

    // Generate button click event
    generateBtn.addEventListener('click', generateDiamond);

    // Download button click event
    downloadBtn.addEventListener('click', downloadImage);

    // Generate diamond on initial load
    generateDiamond();

    function generateDiamond() {
        showLoading();

        setTimeout(() => {
            const size = parseInt(sizeSlider.value);
            const color = colorPicker.value;
            const bgColor = bgColorPicker.value;
            const pattern = patternSelect.value;
            const rotation = parseInt(rotationSlider.value);
            const sparkle = sparkleCheckbox.checked;

            // Clear canvas
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Save context state
            ctx.save();

            // Translate to center of canvas and apply rotation
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation * Math.PI / 180);

            // Calculate diamond properties
            diamondSize = Math.min(canvas.width, canvas.height) * 0.7;
            const cellSize = diamondSize / size;

            // Draw diamond based on selected pattern
            drawDiamondPattern(size, color, pattern, cellSize);

            // Add sparkle if selected
            if (sparkle) {
                addSparkleEffect(size, cellSize);
            }

            // Restore context state
            ctx.restore();

            // Enable download button
            downloadBtn.disabled = false;
            hideLoading();
        }, 500); // Simulating processing delay
    }

    function drawDiamondPattern(size, color, pattern, cellSize) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Draw the diamond outline
        ctx.beginPath();
        ctx.moveTo(0, -diamondSize / 2);
        ctx.lineTo(diamondSize / 2, 0);
        ctx.lineTo(0, diamondSize / 2);
        ctx.lineTo(-diamondSize / 2, 0);
        ctx.closePath();
        ctx.stroke();
        
        if (pattern === 'solid') {
            // Solid fill
            ctx.fillStyle = color;
            ctx.fill();
        } else if (pattern === 'hollow') {
            // Just the outline, already drawn above
        } else if (pattern === 'checkered' || pattern === 'random') {
            // Calculate grid proportions
            const halfSize = Math.floor(size / 2);
            
            for (let y = -halfSize; y <= halfSize; y++) {
                const width = size - Math.abs(y) * 2;
                const halfWidth = Math.floor(width / 2);
                
                for (let x = -halfWidth; x < halfWidth; x++) {
                    // Decide whether to fill this cell
                    let shouldFill = false;
                    
                    if (pattern === 'checkered') {
                        shouldFill = (x + y) % 2 === 0;
                    } else if (pattern === 'random') {
                        shouldFill = Math.random() > 0.5;
                    }
                    
                    if (shouldFill) {
                        ctx.fillStyle = color;
                        ctx.fillRect(
                            x * cellSize - cellSize / 2,
                            y * cellSize - cellSize / 2,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
        }
    }

    function addSparkleEffect(size, cellSize) {
        const sparkleCount = Math.floor(size * 1.5);
        ctx.fillStyle = '#ffffff';
        
        for (let i = 0; i < sparkleCount; i++) {
            // Random position within the diamond
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * diamondSize / 2;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            // Draw sparkle
            const sparkleSize = Math.random() * cellSize * 0.3 + cellSize * 0.1;
            ctx.beginPath();
            ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Occasionally add a "glint" line
            if (Math.random() > 0.7) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x - sparkleSize * 3, y);
                ctx.lineTo(x + sparkleSize * 3, y);
                ctx.moveTo(x, y - sparkleSize * 3);
                ctx.lineTo(x, y + sparkleSize * 3);
                ctx.stroke();
            }
        }
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'rock-diamond.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function showLoading() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }
});
