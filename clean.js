import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const regexes = [
  /console\.log\([^)]+\);?\n?/g,
  /console\.warn\([^)]+\);?\n?/g
];

for (const regex of regexes) {
  content = content.replace(regex, '');
}

fs.writeFileSync('server.ts', content);
