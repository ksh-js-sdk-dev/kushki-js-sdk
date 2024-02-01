const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

delete packageJson.scripts;
delete packageJson.engines;
delete packageJson.dependencies;
delete packageJson.devDependencies;

// Escribe el archivo modificado en la carpeta "dist"
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
