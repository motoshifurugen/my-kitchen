#!/usr/bin/env node
/**
 * Convert base kitchen master PNG to WebP outputs
 *
 * Outputs:
 *   - app/assets/base/kitchen/base-kitchen@2x.webp (1536×2784)
 *   - app/assets/base/kitchen/base-kitchen@1x.webp (768×1392)
 *
 * Usage:
 *   node scripts/build-assets/convert-base-kitchen.js
 *
 * Requires: sharp (npm install sharp)
 */

const path = require('path');
const fs = require('fs');

async function main() {
  // Dynamic import for sharp (ESM module)
  const sharp = (await import('sharp')).default;

  const projectRoot = path.resolve(__dirname, '../..');
  const sourcePath = path.join(
    projectRoot,
    'docs/ux/phase-1/assets/_source/base-kitchen__master.png'
  );
  const outputDir = path.join(projectRoot, 'app/assets/base/kitchen');

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Verify source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Get source dimensions
  const metadata = await sharp(sourcePath).metadata();
  console.log(`Source: ${metadata.width}×${metadata.height}, format: ${metadata.format}, channels: ${metadata.channels}`);

  const hasAlpha = metadata.channels === 4;

  // WebP options for high quality with alpha preservation
  const webpOptions = {
    quality: 90,
    alphaQuality: 100,
    effort: 6, // Higher effort = better compression
    smartSubsample: true,
  };

  // @2x: Same size as master (1536×2784)
  const output2x = path.join(outputDir, 'base-kitchen@2x.webp');
  await sharp(sourcePath)
    .webp(webpOptions)
    .toFile(output2x);

  const stats2x = fs.statSync(output2x);
  const meta2x = await sharp(output2x).metadata();
  console.log(`@2x: ${meta2x.width}×${meta2x.height}, ${(stats2x.size / 1024).toFixed(1)} KB`);

  // @1x: Half size (768×1392)
  const output1x = path.join(outputDir, 'base-kitchen@1x.webp');
  await sharp(sourcePath)
    .resize(768, 1392, {
      kernel: 'lanczos3', // High-quality downscaling
      withoutEnlargement: true,
    })
    .webp(webpOptions)
    .toFile(output1x);

  const stats1x = fs.statSync(output1x);
  const meta1x = await sharp(output1x).metadata();
  console.log(`@1x: ${meta1x.width}×${meta1x.height}, ${(stats1x.size / 1024).toFixed(1)} KB`);

  console.log('\nDone! Files created:');
  console.log(`  ${path.relative(projectRoot, output2x)}`);
  console.log(`  ${path.relative(projectRoot, output1x)}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
