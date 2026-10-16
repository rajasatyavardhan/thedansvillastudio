import { mkdir, copyFile } from 'node:fs/promises';
const files = [
  'index.html', 'student-profile.html', 'preview.jpg', 'robots.txt', 'sitemap.xml',
  'hai-garmi-flyer.jpg', 'hai-garmi-teaser.mp4', 'hai-garmi-thank-you-feedback.png',
  'josh-dancetrotter-flyer.jpg', 'josh-dancetrotter-teaser.mp4', 'josh-dancetrotter-title.jpg'
];
await mkdir('dist', { recursive: true });
await Promise.all(files.map(file => copyFile(file, `dist/${file}`)));
console.log(`Built Dansvilla V64: ${files.length} public files.`);
