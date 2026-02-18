// Flashcard data store
let flashcards = [];

// DOM elements
const elements = {
  termInput: document.getElementById('term-input'),
  definitionInput: document.getElementById('definition-input'),
  categoryInput: document.getElementById('category-input'),
  container: document.getElementById('flashcard-display-container'),
  addBtn: document.getElementById('addBtn'),
  themeToggle: document.getElementById('theme-toggle'),
  uploadInput: document.getElementById('upload-txt'),
  totalCards: document.getElementById('total-cards')
};

// Theme management
const theme = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateIcon(savedTheme);
  },
  
  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateIcon(newTheme);
  },
  
  updateIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
};

// Category colors (soft, accessible palette)
const categoryColors = [
  'rgba(59, 130, 246, 0.1)',  // blue
  'rgba(16, 185, 129, 0.1)',  // green
  'rgba(245, 158, 11, 0.1)',  // yellow
  'rgba(139, 92, 246, 0.1)',  // purple
  'rgba(236, 72, 153, 0.1)',  // pink
  'rgba(239, 68, 68, 0.1)'    // red
];

// Get consistent color for category
function getCategoryColor(category) {
  if (!category) return null;
  
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = ((hash << 5) - hash) + category.charCodeAt(i);
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % categoryColors.length;
  return categoryColors[index];
}

// Save to localStorage
function saveToStorage() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Update stats
function updateStats() {
  if (elements.totalCards) {
    const count = flashcards.length;
    elements.totalCards.textContent = `📊 ${count} card${count !== 1 ? 's' : ''}`;
  }
}

// Create flashcard element
function createFlashcardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'flashcard';
  cardDiv.dataset.id = card.id;
  
  const bgColor = card.category ? getCategoryColor(card.category) : null;
  
  cardDiv.innerHTML = `
    <div class="flashcard-inner">
      <div class="card-front" ${bgColor ? `style="background-color: ${bgColor}"` : ''}>
        ${card.category ? `<span class="card-category">${card.category}</span>` : ''}
        <button class="delete-btn" aria-label="Delete card">×</button>
        <div class="card-term">${escapeHtml(card.term)}</div>
      </div>
      <div class="card-back" ${bgColor ? `style="background-color: ${bgColor}"` : ''}>
        <button class="delete-btn" aria-label="Delete card">×</button>
        <div class="card-definition">${escapeHtml(card.definition)}</div>
      </div>
    </div>
  `;
  
  // Flip on click
  cardDiv.addEventListener('click', (e) => {
    if (!e.target.classList.contains('delete-btn')) {
      cardDiv.classList.toggle('flipped');
    }
  });
  
  // Delete button
  const deleteBtn = cardDiv.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteFlashcard(card.id);
  });
  
  return cardDiv;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render all flashcards
function renderFlashcards() {
  elements.container.innerHTML = '';
  
  if (flashcards.length === 0) {
    elements.container.innerHTML = `
      <div class="empty-state">
        <p>✨ No flashcards yet</p>
        <p class="card-definition">Add your first card using the form above</p>
      </div>
    `;
  } else {
    flashcards.forEach(card => {
      elements.container.appendChild(createFlashcardElement(card));
    });
  }
  
  updateStats();
}

// Delete flashcard
function deleteFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveToStorage();
  renderFlashcards();
  
  // Show feedback
  showNotification('Card deleted', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
  // Simple console for now, could be enhanced with toast notifications
  console.log(`[${type}] ${message}`);
}

// Add new flashcard
function addFlashcard() {
  const term = elements.termInput.value.trim();
  const definition = elements.definitionInput.value.trim();
  const category = elements.categoryInput.value.trim();
  
  if (!term || !definition) {
    showNotification('Please enter both term and definition', 'error');
    return;
  }
  
  const newCard = {
    id: Date.now().toString(),
    term,
    definition,
    category: category || null,
    created: new Date().toISOString()
  };
  
  flashcards.push(newCard);
  saveToStorage();
  renderFlashcards();
  
  // Clear inputs
  elements.termInput.value = '';
  elements.definitionInput.value = '';
  elements.categoryInput.value = '';
  
  // Focus back on term input
  elements.termInput.focus();
  
  showNotification('Card added successfully', 'success');
}

// Parse and import from text file
async function importFromFile(file) {
  try {
    const text = await file.text();
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    let category = null;
    let startIndex = 0;
    
    // Check if first line is category (in quotes)
    if (lines[0] && lines[0].startsWith('"') && lines[0].endsWith('"')) {
      category = lines[0].slice(1, -1).trim();
      startIndex = 1;
    }
    
    let imported = 0;
    let skipped = 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split('-').map(part => part.trim());
      
      if (parts.length === 2) {
        const [term, definition] = parts;
        flashcards.push({
          id: `${Date.now()}-${i}-${Math.random()}`,
          term,
          definition,
          category: category || null,
          created: new Date().toISOString()
        });
        imported++;
      } else {
        skipped++;
      }
    }
    
    saveToStorage();
    renderFlashcards();
    
    showNotification(`Imported ${imported} cards (${skipped} skipped)`, 'success');
  } catch (error) {
    console.error('Import error:', error);
    showNotification('Error importing file', 'error');
  }
}

// Event listeners
elements.addBtn.addEventListener('click', addFlashcard);

// Enter key in inputs
[elements.termInput, elements.definitionInput, elements.categoryInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addFlashcard();
    }
  });
});

// Theme toggle
elements.themeToggle.addEventListener('click', () => theme.toggle());

// File upload
elements.uploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      await importFromFile(file);
    } else {
      showNotification('Please upload a .txt file', 'error');
    }
  }
  elements.uploadInput.value = ''; // Reset input
});

// Initialize
function init() {
  theme.init();
  
  // Load from localStorage
  const stored = localStorage.getItem('flashcards');
  if (stored) {
    try {
      flashcards = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load flashcards:', e);
      flashcards = [];
    }
  }
  
  renderFlashcards();
}

// Start the app
init();