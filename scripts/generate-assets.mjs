import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, '../assets/_templates');
const OUTPUT_DIR = path.resolve(__dirname, '../assets');

// Consolidated mapped files
const files = [
    // Core Icons (from logo.svg)
    { input: 'logo.svg', output: 'icon-only.png', width: 1024, height: 1024 },
    { input: 'logo.svg', output: 'icon-foreground.png', width: 1024, height: 1024 },
    // Background can be simple color or generic
    { input: 'icon-background.svg', output: 'icon-background.png', width: 1024, height: 1024 },

    // Splashes (Keep existing style)
    { input: 'splash.svg', output: 'splash.png', width: 2732, height: 2732 },
    { input: 'splash-dark.svg', output: 'splash-dark.png', width: 2732, height: 2732 },

    // Featured App Logo
    { input: 'logo.svg', output: 'app-logo.png', width: 512, height: 512 }
];

async function generate() {
    console.log('🖼️  Generating assets from templates...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const file of files) {
        const inputPath = path.join(TEMPLATE_DIR, file.input);
        const outputPath = path.join(OUTPUT_DIR, file.output);

        try {
            if (!fs.existsSync(inputPath)) {
                console.warn(`⚠️  Template not found: ${file.input}`);
                continue;
            }

            await sharp(inputPath)
                .resize(file.width, file.height)
                .png()
                .toFile(outputPath);

            console.log(`✅ Generated: ${file.output}`);
        } catch (error) {
            console.error(`❌ Error generating ${file.output}:`, error);
        }
    }
}

generate();
