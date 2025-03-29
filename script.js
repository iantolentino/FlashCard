// Array to store flashcards (each with a unique id)
let flashcards = [];

// Selecting necessary elements
const termInput = document.getElementById('term-input');
const definitionInput = document.getElementById('definition-input');
const categoryInput = document.getElementById('category-input');
const flashcardContainer = document.getElementById('flashcard-display-container');
const addBtn = document.getElementById('addBtn');
const themeToggle = document.getElementById('theme-toggle');
const uploadTxtInput = document.getElementById('upload-txt');

// Pastel color mapping for categories (adjust as needed)
const pastelColors = [
  "#FFB3BA", // pastel red
  "#FFDFBA", // pastel orange
  "#FFFFBA", // pastel yellow
  "#BAFFC9", // pastel green
  "#BAE1FF"  // pastel blue
];

// Helper function to get a pastel color based on category text
function getPastelColor(category) {
  let sum = 0;
  for (let i = 0; i < category.length; i++) {
    sum += category.charCodeAt(i);
  }
  return pastelColors[sum % pastelColors.length];
}

// Save flashcards array to localStorage
function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Render all flashcards from the array
function renderFlashcards() {
  flashcardContainer.innerHTML = '';
  flashcards.forEach(card => {
    createFlashcardElement(card);
  });
}

// Create a flashcard element and add to the DOM
function createFlashcardElement(card) {
  const flashcardElement = document.createElement('div');
  flashcardElement.classList.add('flashcard');
  flashcardElement.setAttribute('data-id', card.id);

  // If a category is provided, set a pastel background color
  if (card.category) {
    flashcardElement.style.backgroundColor = getPastelColor(card.category);
  }

  // Create inner container for full flip effect
  const inner = document.createElement('div');
  inner.classList.add('flashcard-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  front.textContent = card.term;

  const back = document.createElement('div');
  back.classList.add('card-back');
  back.textContent = card.definition;

  inner.appendChild(front);
  inner.appendChild(back);

  // Create delete button as plain "x" and position it in upper right corner of the card
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = "x";
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering flip
    deleteFlashcard(card.id);
  });
  // Append delete button inside the inner container so it flips with the card
  inner.appendChild(deleteBtn);

  flashcardElement.appendChild(inner);

  // Click event to flip the entire card
  flashcardElement.addEventListener('click', () => {
    flashcardElement.classList.toggle('flipped');
  });

  flashcardContainer.appendChild(flashcardElement);
}

// Delete a flashcard by id
function deleteFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  saveFlashcards();
  renderFlashcards();
}

// Event Listener for Add Button
addBtn.addEventListener('click', () => {
  const term = termInput.value.trim();
  const definition = definitionInput.value.trim();
  const category = categoryInput.value.trim();

  if (term && definition) {
    const newCard = {
      id: Date.now(),  // unique id
      term,
      definition,
      category: category || null
    };
    flashcards.push(newCard);
    saveFlashcards();
    createFlashcardElement(newCard);

    termInput.value = '';
    definitionInput.value = '';
    categoryInput.value = '';
  } else {
    alert('Please fill out both term and definition.');
  }
});

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Toggle dark mode on all card elements too
  document.querySelectorAll('.flashcard, .card-front, .card-back').forEach(card => {
    card.classList.toggle('dark-mode');
  });
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀ Light Mode' : '⏾ Dark Mode';
});

// Handle .txt file uploads
uploadTxtInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Only process if it's a .txt
  if (file.type !== 'text/plain') {
    alert('Please upload a .txt file');
    return;
  }

  try {
    const text = await file.text();
    // Split text into lines and remove empty ones
    let lines = text.split('\n').map(line => line.trim()).filter(line => line);

    let fileCategory = null;
    // If the first line starts and ends with double quotes, use it as the category
    if (lines[0].startsWith('"') && lines[0].endsWith('"')) {
      fileCategory = lines[0].slice(1, -1).trim();
      lines.shift(); // Remove the category line from processing
    }

    // Process each remaining line. Each should be in "Term - Definition" format.
    lines.forEach(line => {
      const parts = line.split('-').map(part => part.trim());
      if (parts.length === 2) {
        const [term, definition] = parts;
        const newCard = {
          id: Date.now() + Math.random(), // unique-ish id
          term,
          definition,
          category: fileCategory || null
        };
        flashcards.push(newCard);
      } else {
        console.warn(`Skipping malformed line: ${line}`);
      }
    });

    saveFlashcards();
    renderFlashcards();
    // Reset the input so we can upload again if needed
    uploadTxtInput.value = '';
  } catch (error) {
    console.error('Error reading file:', error);
  }
});


// On page load, retrieve flashcards from localStorage (if any)
window.addEventListener('DOMContentLoaded', () => {
  const storedCards = localStorage.getItem('flashcards');
  if (storedCards) {
    flashcards = JSON.parse(storedCards);
    renderFlashcards();
  }
});
