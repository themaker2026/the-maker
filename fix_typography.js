const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                processDirectory(fullPath);
            }
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            
            // #2D2D2D -> #000000
            if (content.includes('#2D2D2D')) {
                content = content.replace(/#2D2D2D/gi, '#000000');
                changed = true;
            }
            // #666 -> #222222
            if (content.includes('#666')) {
                content = content.replace(/#666\b/g, '#222222');
                content = content.replace(/#666666\b/g, '#222222');
                changed = true;
            }
            // #888 -> #444444
            if (content.includes('#888')) {
                content = content.replace(/#888\b/g, '#444444');
                content = content.replace(/#888888\b/g, '#444444');
                changed = true;
            }
            // #555 -> #111111
            if (content.includes('#555')) {
                content = content.replace(/#555\b/g, '#111111');
                content = content.replace(/#555555\b/g, '#111111');
                changed = true;
            }
            // #444 -> #000000 (Very dark grey to black)
            if (content.includes('#444')) {
                content = content.replace(/#444\b/g, '#000000');
                content = content.replace(/#444444\b/g, '#000000'); // Note: it will process previously changed #444444. Wait.
            }

            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

processDirectory('./src');
console.log('Done');
