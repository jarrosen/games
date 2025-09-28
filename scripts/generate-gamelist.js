const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const games = [];

// Clean and create dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Find all game directories and copy them to dist
fs.readdirSync(rootDir).forEach(file => {
    const fullPath = path.join(rootDir, file);
    // We are looking for directories that contain a game.json
    if (fs.lstatSync(fullPath).isDirectory()) {
        const gameJsonPath = path.join(fullPath, 'game.json');
        if (fs.existsSync(gameJsonPath)) {
            try {
                // Copy the entire game directory to dist
                fs.cpSync(fullPath, path.join(distDir, file), { recursive: true });
                console.log(`Copied game directory: ${file}`);

                const content = fs.readFileSync(gameJsonPath, 'utf-8');
                const gameData = JSON.parse(content);
                // The link is just the directory name
                gameData.link = `${file}/`;
                games.push(gameData);
                console.log(`Found and processed game: ${gameData.title}`);

            } catch (error) {
                console.error(`Error processing directory ${file}:`, error);
            }
        }
    }
});

// Copy the main index.html to dist
const indexHtmlPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, path.join(distDir, 'index.html'));
    console.log('Copied main index.html to dist/');
}

// Write the games array to a JS file inside dist
const gamesJsContent = `const games = ${JSON.stringify(games, null, 2)};`;
fs.writeFileSync(path.join(distDir, 'games.js'), gamesJsContent);

console.log(`Successfully generated dist/games.js with ${games.length} games.`);
console.log('Build process complete. The "dist" directory is ready for deployment.');