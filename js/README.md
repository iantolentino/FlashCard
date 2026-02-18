# Flashcard App

A minimalist, browser-based flashcard application for effective studying. Create, manage, and review flashcards directly in your web browser.

**Live Site:** [iantolentino.github.io/FlashCard/](https://iantolentino.github.io/FlashCard/)

## Features

- **Create Flashcards** – Add new cards by entering a term, definition, and optional category.
- **Organize with Categories** – Cards are color-coded based on their category for visual grouping.
- **Flip to Review** – Click any card to flip it and reveal the definition.
- **Dark Mode Toggle** – Switch between light and dark themes for comfortable viewing.
- **Import from Text File** – Bulk upload flashcards using a simple `.txt` file format.
- **Persistent Storage** – All cards are saved automatically in your browser's local storage.

## How to Use

### Adding a Flashcard
1. Enter the **Term** in the first input field.
2. Enter the **Definition** in the second field.
3. (Optional) Enter a **Category** to group related cards.
4. Click the **"Add Flashcard"** button.

### Importing Flashcards
1. Prepare a `.txt` file.
2. To set a category for all cards in the file, make the first line the category name enclosed in double quotes (e.g., `"French Vocabulary"`).
3. On the following lines, use the format: `Term - Definition`.
4. Click the **"Upload a text"** button and select your file.

**Example file format:**
```
"Science Terms"
Atom - The basic unit of a chemical element.
DNA - A molecule that carries genetic information.
```

### Managing Cards
- **Flip a Card:** Click on any card to view its definition.
- **Delete a Card:** Click the **"x"** button in the top-right corner of a card.
- **Toggle Theme:** Use the **"⏾ Dark Mode"** button to switch themes.

## Technology

- Built with plain HTML, CSS, and JavaScript.
- Uses `localStorage` for client-side data persistence.
- No external dependencies or frameworks.

## Local Setup

To run this project locally:
1. Download the `index.html`, `css/style.css`, and `js/script.js` files.
2. Place them in the same folder structure on your computer.
3. Open the `index.html` file in any modern web browser.

## License

This project is open-source and free to use for personal or educational purposes.
