const fs = require('fs');
const child_process = require('child_process');

console.log("Installing marked parser...");
child_process.execSync('npm install marked --no-save', { stdio: 'inherit' });
const marked = require('marked');

console.log("Reading files...");
const md = fs.readFileSync('rangkumannih.md', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

console.log("Parsing markdown...");
const htmlContent = marked.parse(md);

const finalHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rangkuman Tata Bahasa Jepang</title>
    <style>
        ${css}
        
        /* Pengaturan khusus agar saat dicetak ke PDF (Print to PDF) tetap cantik */
        @media print {
            body { 
                padding: 0; 
                margin: 0; 
                max-width: none; 
            }
            h1 { margin-top: 0; }
            h2 { 
                page-break-after: avoid; 
                margin-top: 30px; 
            }
            li { 
                page-break-inside: avoid; 
            }
            /* Memaksa browser mencetak warna background */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

fs.writeFileSync('rangkumannih.html', finalHtml);
console.log("File rangkumannih.html berhasil dibuat!");
