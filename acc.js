// Track the selected character
let selectedCharacter = null;

// Select Character function
function selectCharacter(character) {
    selectedCharacter = character;
    
    // Update UI to show selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
        card.style.border = 'none';
    });
    
    // Highlight the selected character
    const selectedCard = document.querySelector(`[onclick="selectCharacter('${character}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.style.border = '2px solid var(--primary-light)';
    }
    
    // Enable the presentation upload section
    const uploadSection = document.querySelector('.upload-section');
    uploadSection.style.opacity = '1';
    uploadSection.style.pointerEvents = 'auto';
    
    // Update instruction text
    const instructionText = document.createElement('p');
    instructionText.className = 'instruction-text';
    instructionText.textContent = `تم اختيار ${getCharacterName(character)}. الآن قم بتحميل العرض التقديمي.`;
    instructionText.style.color = 'var(--primary-light)';
    instructionText.style.textAlign = 'center';
    instructionText.style.marginTop = '10px';
    
    // Remove any previous instruction
    const oldInstruction = document.querySelector('.instruction-text');
    if (oldInstruction) {
        oldInstruction.remove();
    }
    
    // Add the instruction after character selection
    document.querySelector('.character-cards').after(instructionText);
}

// Helper function to get character name in Arabic
function getCharacterName(character) {
    switch(character) {
        case 'MrFares':
            return 'السيد فارس';
        case 'EngineerSara':
            return 'المهندسة سارة';
        case 'DrAbdullah':
            return 'د. عبدالله';
        default:
            return character;
    }
}

// Initial setup - disable upload until character is selected
document.addEventListener('DOMContentLoaded', function() {
    // Disable upload section initially
    const uploadSection = document.querySelector('.upload-section');
    uploadSection.style.opacity = '0.6';
    uploadSection.style.pointerEvents = 'none';
    
    // Add file upload button and functionality
    const fileUpload = document.querySelector('.file-upload');
    
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'presentationFile';
    fileInput.accept = '.pptx,.pdf,.odp';
    fileInput.style.display = 'none';
    
    // Create upload button
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'btn-upload';
    uploadBtn.textContent = 'اختر ملف';
    uploadBtn.onclick = function(e) {
        e.preventDefault();
        if (!selectedCharacter) {
            alert('الرجاء اختيار المقدم أولاً');
            return;
        }
        fileInput.click();
    };
    
    // Add elements to DOM
    fileUpload.appendChild(fileInput);
    fileUpload.appendChild(uploadBtn);
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : "لم يتم اختيار ملف";
        document.querySelector('.upload-text').textContent = fileName;
        
        if (this.files[0]) {
            // Enable the webcam button once a file is selected
            document.getElementById('start-webcam').disabled = false;
            
            // Add download button
            addDownloadButton(this.files[0]);
        }
    });
    
    // Disable webcam button initially
    const webcamButton = document.getElementById('start-webcam');
    if (webcamButton) {
        webcamButton.disabled = true;
    }
    
    // Initialize settings functionality
    initializeSettings();
});

// Function to add download button
function addDownloadButton(file) {
    // Remove any existing download button
    const existingBtn = document.getElementById('download-presentation');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'download-presentation';
    downloadBtn.className = 'btn-primary';
    downloadBtn.textContent = 'تحميل العرض';
    downloadBtn.style.marginTop = '15px';
    
    // Add click event to download
    downloadBtn.addEventListener('click', function() {
        // Create download URL
        const url = URL.createObjectURL(file);
        
        // Create temporary link and click it
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Add to upload section
    document.querySelector('.upload-section').appendChild(downloadBtn);
}

// Webcam functions
let webcamStream;

function startWebcam() {
  const video = document.getElementById('webcam-video');
  const button = document.getElementById('start-webcam');

  if (!selectedCharacter) {
    alert('الرجاء اختيار المقدم أولاً');
    return;
  }

  if (!webcamStream) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      webcamStream = stream;
      video.srcObject = stream;
      video.style.display = "block";
      button.textContent = "إيقاف الكاميرا";
    }).catch(err => {
      alert("تعذر الوصول إلى الكاميرا.");
    });
  } else {
    stopWebcam();
  }
}

function stopWebcam() {
  const video = document.getElementById('webcam-video');
  const button = document.getElementById('start-webcam');

  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
    video.style.display = "none";
    button.textContent = "شغل الكاميرا";
  }
}

document.getElementById('start-webcam').addEventListener('click', startWebcam);

document.getElementById('presentationFile').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : "لم يتم اختيار ملف";
    document.getElementById('fileName').textContent = fileName;
});

// SETTINGS FUNCTIONALITY - NEW CODE

// Initialize Settings
function initializeSettings() {
    // Setup search functionality
    initializeSettingsSearch();
    
    // Setup clickable setting chips
    initializeSettingChips();
    
    // Setup filler words functionality
    initializeFillerWords();
}

// Initialize Settings Search
function initializeSettingsSearch() {
    const searchInput = document.getElementById('settingsSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const allChips = document.querySelectorAll('.setting-chip');
            
            allChips.forEach(chip => {
                const chipText = chip.textContent.toLowerCase();
                const section = chip.closest('.settings-section');
                
                if (chipText.includes(searchTerm)) {
                    chip.style.display = 'inline-block';
                    if (section) section.style.display = 'block';
                } else {
                    chip.style.display = 'none';
                }
            });
            
            // Show all sections if search is empty
            if (searchTerm === '') {
                document.querySelectorAll('.settings-section').forEach(section => {
                    section.style.display = 'block';
                });
                allChips.forEach(chip => {
                    chip.style.display = 'inline-block';
                });
            }
            
            // Hide section headers if all chips in a section are hidden
            document.querySelectorAll('.settings-section').forEach(section => {
                const visibleChips = section.querySelectorAll('.setting-chip[style="display: inline-block;"]');
                if (visibleChips.length === 0 && searchTerm !== '') {
                    section.style.display = 'none';
                }
            });
        });
    }
}

// Initialize Setting Chips
function initializeSettingChips() {
    const settingChips = document.querySelectorAll('.setting-chip');
    
    settingChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // For category chips, show only that category
            if (this.dataset.category) {
                // Toggle this category
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                
                // Show/hide related section 

                document.querySelectorAll(`[data-section="${this.dataset.category}"]`).forEach(section => {
                    section.style.display = isActive ? 'block' : 'none';
                });
            } 
            // For feature chips, just toggle their active state
            else if (this.dataset.feature) {
                this.classList.toggle('active');
                
                // Optional: Update some UI based on which features are active
                updateFeatureSettings();
            }
        });
    });
}

// Update Feature Settings
function updateFeatureSettings() {
    // This function can be expanded to apply changes when features are toggled
    // For example, you could update a settings object or change UI elements
    
    // Get all active features
    const activeFeatures = [];
    document.querySelectorAll('.setting-chip.active[data-feature]').forEach(chip => {
        activeFeatures.push(chip.dataset.feature);
    });
    
    console.log('Active features:', activeFeatures);
    
    // Example: If volume is active, show volume slider
    if (activeFeatures.includes('volume')) {
        const volumeSlider = document.querySelector('.slider-container[data-feature="volume"]');
        if (volumeSlider) volumeSlider.style.display = 'flex';
    } else {
        const volumeSlider = document.querySelector('.slider-container[data-feature="volume"]');
        if (volumeSlider) volumeSlider.style.display = 'none';
    }
}

// Initialize Filler Words
function initializeFillerWords() {
    const fillerInput = document.getElementById('fillerWords');
    const addButton = document.querySelector('.btn-add');
    const fillerTags = document.querySelector('.filler-tags');
    
    if (addButton && fillerInput && fillerTags) {
        addButton.addEventListener('click', function() {
            addFillerWord(fillerInput, fillerTags);
        });
        
        // Add tag when pressing Enter
        fillerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addFillerWord(fillerInput, fillerTags);
            }
        });
        
        // Add delete functionality to existing tags
        document.querySelectorAll('.filler-tag i').forEach(icon => {
            icon.addEventListener('click', function() {
                this.parentElement.remove();
            });
        });
    }
}

// Add Filler Word
function addFillerWord(input, tagsContainer) {
    const word = input.value.trim();
    if (word) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'filler-tag';
        tagSpan.innerHTML = `${word} <i class="fas fa-times"></i>`;

        
        // Add delete functionality to the tag
        const deleteIcon = tagSpan.querySelector('i');
        deleteIcon.addEventListener('click', function() {
            tagSpan.remove();
        });
        
        tagsContainer.appendChild(tagSpan);
        input.value = '';
    }
}

// Save Settings
function saveSettings() {
    // Collect all settings
    const settings = {
        activeFeatures: [],
        fillerWords: [],
        sliderValues: {}
    };
    
    // Get active features
    document.querySelectorAll('.setting-chip.active').forEach(chip => {
        if (chip.dataset.feature) {
            settings.activeFeatures.push(chip.dataset.feature);
        }
    });
    
    // Get filler words
    document.querySelectorAll('.filler-tag').forEach(tag => {
        const word = tag.textContent.trim();
        if (word) settings.fillerWords.push(word);
    });
    
    // Get slider values
    document.querySelectorAll('.slider').forEach(slider => {
        if (slider.id) {
            settings.sliderValues[slider.id] = slider.value;
        }
    });
    
    console.log('Saved settings:', settings);
    
    // For now, just show an alert; in a real app, you'd save to a server or localStorage
    alert('تم حفظ الإعدادات بنجاح!');
    
    return settings;
}

// Add event listener to the save button
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.querySelector('.btn-save');
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    }
});