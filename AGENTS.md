# How to Add a New Game to the Hub

This project uses an automated system to generate the game list on the main `index.html` page. To add a new game, you **must** follow this process. Do not edit the `index.html` file directly to add a game.

## The Process

1.  **Create a New Directory:** Create a new directory in the root of the repository for your game. The name of this directory will become the URL path for the game (e.g., a directory named `my-new-game` will be accessible at `.../my-new-game/`).

2.  **Add Game Files:** Place all the files for your game (e.g., `index.html`, `style.css`, `script.js`) inside the new directory you created.

3.  **Create a `game.json` file:** Inside your game's directory, create a metadata file named `game.json`. This file **must** contain the following fields:

    ```json
    {
      "title": "Your Game Title",
      "description": "A short, engaging description of your game.",
      "image": "https://path.to/your/game-image.png",
      "creator": "Your Name",
      "tags": ["Tag1", "Tag2", "Another Tag"]
    }
    ```

    -   `title`: The name of the game.
    -   `description`: A brief summary of the game.
    -   `image`: A URL to a thumbnail image for the game card.
    -   `creator`: The name of the person who made the game.
    -   `tags`: An array of strings for filtering. Use relevant categories like "Action", "RPG", "2 Player", etc.

4.  **Commit Your Changes:** Commit the new directory, game files, and the `game.json` file.

## Automation

Once you commit your changes to the `main` branch, a GitHub Actions workflow will automatically run. This workflow executes the `scripts/generate-gamelist.js` script, which:
- Finds all `game.json` files in the repository.
- Copies the game directories into a `dist` folder.
- Generates a new `dist/games.js` file containing the list of all games.
- Deploys the `dist` folder to GitHub Pages.

Your new game will then automatically appear on the main landing page.