const fs = require('fs');

const txt = fs.readFileSync('rangkumannih.txt', 'utf8');
const lines = txt.split('\n');

let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rangkuman Tata Bahasa Jepang</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background-color: #f4f7f6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .chapter-container {
            background-color: #274b74;
            color: white;
            padding: 24px 32px;
            border-radius: 10px 10px 0 0;
            margin-top: 50px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .chapter-number {
            font-size: 13px;
            letter-spacing: 2px;
            opacity: 0.8;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .chapter-title {
            font-size: 26px;
            font-weight: 700;
            margin: 0;
            line-height: 1.3;
        }
        
        .chapter-content {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 10px 10px;
            padding: 32px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        
        .grammar-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            background-color: #ffffff;
        }
        
        .grammar-card:last-child {
            margin-bottom: 0;
        }
        
        .grammar-title {
            font-size: 18px;
            color: #1e3a8a;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
        }
        
        .grammar-formula {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            color: #0369a1;
            padding: 10px 16px;
            border-radius: 6px;
            display: inline-block;
            font-family: 'Consolas', monospace;
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 16px;
        }
        
        .grammar-desc {
            margin-bottom: 20px;
            line-height: 1.6;
            color: #475569;
            font-size: 15px;
        }
        
        .example-box {
            background-color: #f8fafc;
            padding: 16px 20px;
            border-radius: 6px;
            border-left: 4px solid #cbd5e1;
        }
        
        .example-jp {
            font-size: 16px;
            margin-bottom: 6px;
            color: #0f172a;
        }
        
        .example-id {
            font-size: 14px;
            color: #64748b;
            font-style: italic;
        }
        
        /* Print rules */
        @media print {
            body { 
                background-color: white; 
                padding: 0; 
                max-width: none; 
            }
            .chapter-container, .chapter-content {
                box-shadow: none;
            }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .chapter-container {
                page-break-after: avoid;
                margin-top: 30px;
            }
            .grammar-card {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
`;

let inChapter = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Match Chapter e.g. "BAB 1 — Dasar Kalimat"
    const chapterMatch = line.match(/^BAB\s+(\d+)\s+[—\-]\s+(.*)$/i);
    if (chapterMatch) {
        if (inChapter) {
            html += '\n    </div>\n'; // Close previous chapter-content
        }
        html += '\n    <div class="chapter-container">\n        <div class="chapter-number">BAB ' + chapterMatch[1] + '</div>\n        <h1 class="chapter-title">' + chapterMatch[2] + '</h1>\n    </div>\n    <div class="chapter-content">';
        inChapter = true;
        continue;
    }
    
    // Match Grammar Point e.g. "1. [KB1] wa [KB2] desu — KB1 adalah KB2 (kalimat positif). Contoh: 私は学生です (Saya adalah siswa)."
    const grammarMatch = line.match(/^(\d+)\.\s+(.*?)\s+[—\-]\s+(.*)$/);
    
    if (grammarMatch) {
        const num = grammarMatch[1];
        const formula = grammarMatch[2].trim();
        let remaining = (grammarMatch[3] || '').trim();
        
        let desc = remaining;
        let exJp = '';
        let exId = '';
        
        if (remaining.includes('Contoh:')) {
            const parts = remaining.split('Contoh:');
            desc = parts[0].trim();
            const examplePart = parts[1].trim();
            
            const exMatch = examplePart.match(/^(.*?)\s*\((.*?)\)\.?$/);
            if (exMatch) {
                exJp = exMatch[1].trim();
                exId = exMatch[2].trim();
            } else {
                exJp = examplePart;
            }
        }
        
        let titleClean = formula.replace(/\[(.*?)\]/g, '$1'); 
        
        html += '\n        <div class="grammar-card">\n            <h2 class="grammar-title">' + num + '. ' + titleClean + '</h2>\n            <div class="grammar-formula">' + formula + '</div>';
            
        if (desc) {
            html += '\n            <div class="grammar-desc">' + desc + '</div>';
        }
            
        if (exJp || exId) {
            html += '\n            <div class="example-box">';
            if (exJp) {
                html += '\n                <div class="example-jp">' + exJp + '</div>';
            }
            if (exId) {
                html += '\n                <div class="example-id">' + exId + '</div>';
            }
            html += '\n            </div>';
        }
            
        html += '\n        </div>';
    }
}

if (inChapter) {
    html += '\n    </div>\n';
}

html += `
</body>
</html>
`;

fs.writeFileSync('rangkumannih.html', html);
console.log("HTML generated beautifully.");
