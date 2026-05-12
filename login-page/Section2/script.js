// Store user selections
const selections = {
    location: null,
    buildingType: null,
    area: null,
    floors: null,
    doors: null,
    windows: null,
    flooring: null,
    lighting: null,
    paint: null,
    wallpaper: null,
    pool: null,
    outdoor: null,
    stairs: null,
    kitchen: null,
    bathroom: null
};

// Price mapping for cost calculation
const prices = {
    location: { City: 50000, Suburb: 40000, Coastal: 60000 },
    buildingType: { Residential: 100000, Premium: 200000 },
    area: { '167 sq yards': 167000, '220 sq yards': 220000, '500 sq yards': 500000 },
    floors: { '1': 50000, '2': 100000, '3': 150000 },
    doors: { 'Modern Doors': 5000 },
    windows: { 'Glass Windows': 3000 },
    flooring: { Marble: 20000, Wood: 15000 },
    lighting: { Chandelier: 5000, 'Smart LED': 3000 },
    paint: { Red: 2000, Blue: 2000, Green: 2000 },
    wallpaper: { Floral: 3000, 'Modern Art': 4000 },
    pool: { 'Indoor Pool': 25000 },
    outdoor: { Garden: 10000, Balcony: 8000 },
    stairs: { 'Floating Stairs': 12000 },
    kitchen: { 'Modern Kitchen': 25000 },
    bathroom: { 'Luxury Bathroom': 18000 }
};

// Select an option and highlight it
function selectOption(category, value, element) {
    // Remove selected class from all options in this category
    const options = document.querySelectorAll(`[onclick*="selectOption('${category}'"]`);
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Store selection
    selections[category] = value;
    
    // Update preview if on summary step
    if (document.getElementById('summary').classList.contains('active')) {
        updateSummary();
    }
}

// Show coming soon alert
function showComingSoon() {
    alert('This feature is coming soon! Stay tuned!');
}

// Update custom inputs
function updatePreview() {
    const customArea = document.getElementById('customArea').value;
    const customFloors = document.getElementById('customFloors').value;
    
    if (customArea) {
        selections.area = `${customArea} sq yards`;
        prices.area[selections.area] = customArea * 1000; // $1000 per sq yard
    }
    
    if (customFloors) {
        selections.floors = customFloors;
        prices.floors[selections.floors] = customFloors * 50000; // $50k per floor
    }
    
    if (document.getElementById('summary').classList.contains('active')) {
        updateSummary();
    }
}

// Calculate total cost
function calculateCost() {
    let total = 0;
    
    for (const category in selections) {
        if (selections[category] && prices[category]) {
            total += prices[category][selections[category]] || 0;
        }
    }
    
    return total;
}

// Update summary section
function updateSummary() {
    for (const category in selections) {
        const element = document.getElementById(`final${category.charAt(0).toUpperCase() + category.slice(1)}`);
        if (element) {
            element.textContent = selections[category] || 'Not selected';
        }
    }
    
    document.getElementById('finalCost').textContent = calculateCost().toLocaleString();
}

// Navigation between steps
function nextStep(currentId, nextId) {
    document.getElementById(currentId).classList.remove('active');
    document.getElementById(nextId).classList.add('active');
    
    // Update progress bar
    const stepNumber = parseInt(nextId.replace('step', '')) || 8; // summary is step 8
    document.getElementById('progressBar').style.width = `${(stepNumber / 8) * 100}%`;
    
    // Update summary if we're going to summary step
    if (nextId === 'summary') {
        updateSummary();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(currentId, prevId) {
    document.getElementById(currentId).classList.remove('active');
    document.getElementById(prevId).classList.add('active');
    
    // Update progress bar
    const stepNumber = parseInt(prevId.replace('step', '')) || 1;
    document.getElementById('progressBar').style.width = `${(stepNumber / 8) * 100}%`;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save current design
function saveDesign() {
    const designData = {
        selections: {...selections},
        totalCost: calculateCost(),
        timestamp: new Date().toISOString()
    };
    
    // Get existing saves or create empty array
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    
    // Add new design
    savedDesigns.push(designData);
    
    // Save back to localStorage
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
    
    showSavedDesigns();
}

// Show saved designs in new window
function showSavedDesigns() {
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    const newWindow = window.open('saved-designs.html', '_blank', 'width=800,height=600');
    
    newWindow.onload = function() {
        const designsList = newWindow.document.getElementById('savedDesignsList');
        
        if (savedDesigns.length === 0) {
            designsList.innerHTML = '<p>No designs saved yet</p>';
            return;
        }
        
        savedDesigns.forEach((design, index) => {
            const designEl = newWindow.document.createElement('div');
            designEl.className = 'saved-design';
            designEl.innerHTML = `
                <h4>Design #${index + 1}</h4>
                <p>Saved: ${new Date(design.timestamp).toLocaleString()}</p>
                <p>Total Cost: $${design.totalCost.toLocaleString()}</p>
                <div class="design-actions">
                    <button class="load-btn" onclick="window.opener.loadDesign(${index}); window.close();">Load</button>
                    <button class="delete-btn" onclick="window.opener.deleteDesign(${index}); this.parentNode.parentNode.remove();">Delete</button>
                </div>
            `;
            designsList.appendChild(designEl);
        });
    };
}

// Delete a saved design
function deleteDesign(index) {
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    if (index >= savedDesigns.length) return;
    
    savedDesigns.splice(index, 1);
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
    
    // Refresh the designs window if it's open
    const designsWindow = window.open('', 'Saved Designs');
    if (designsWindow && designsWindow.location.href.includes('saved-designs.html')) {
        designsWindow.location.reload();
    }
}

// Load a saved design
function loadDesign(index) {
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    if (index >= savedDesigns.length) return;
    
    const design = savedDesigns[index];
    
    // Restore selections
    for (const category in design.selections) {
        selections[category] = design.selections[category];
        
        // Update UI selections
        const selectedOption = document.querySelector(`[onclick*="selectOption('${category}', '${design.selections[category]}'"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    // Update summary if on summary page
    if (document.getElementById('summary').classList.contains('active')) {
        updateSummary();
    }
    
    alert('Design loaded successfully!');
}

// Restart design process
function restartDesign() {
    // Reset selections
    for (const category in selections) {
        selections[category] = null;
    }
    
    // Reset UI
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('customArea').value = '';
    document.getElementById('customFloors').value = '';
    
    // Go back to step 1
    document.querySelector('.step.active').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('progressBar').style.width = '12.5%';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}