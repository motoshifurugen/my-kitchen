#!/usr/bin/env node
/**
 * Asset Pipeline Generator
 *
 * Generates WebP assets from source PNG masters and updates manifest.ts
 *
 * Usage:
 *   npm run assets          # Generate all asset groups
 *   npm run assets:menu     # Generate only menu-icons
 */

import { fileURLToPath } from 'url';
import { dirname, resolve, join, relative } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import sharp from 'sharp';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// ============================================================================
// Configuration
// ============================================================================

const ASSET_GROUPS = {
  menu: {
    source: 'docs/ux/phase-1/assets/_source/menu-icons/*.png',
    output: 'app/assets/menu-icons',
    manifestKey: 'MENU_ICONS',
    manifestPath: 'app/src/assets/manifest.ts',
  },
  backgrounds: {
    source: 'docs/ux/phase-1/assets/_source/tools/tools_shell__master.png',
    output: 'app/assets/backgrounds',
    manifestKey: 'BACKGROUND_ASSETS',
    manifestPath: 'app/src/assets/manifest.ts',
  },
};

// ============================================================================
// WebP Generation
// ============================================================================

const WEBP_OPTIONS = {
  quality: 85,
  alphaQuality: 85,
  effort: 6,
  smartSubsample: true,
};

/**
 * Generate @2x and @1x WebP files from a source PNG
 */
async function generateWebPAssets(sourcePath, outputDir, baseName) {
  const output2x = join(outputDir, `${baseName}@2x.webp`);
  const output1x = join(outputDir, `${baseName}@1x.webp`);

  // Get source metadata
  const metadata = await sharp(sourcePath).metadata();
  const hasAlpha = metadata.channels === 4;

  // @2x: Same resolution as source
  await sharp(sourcePath)
    .webp({ ...WEBP_OPTIONS, alphaQuality: hasAlpha ? WEBP_OPTIONS.alphaQuality : undefined })
    .toFile(output2x);

  // @1x: 50% width/height
  const width1x = Math.floor(metadata.width / 2);
  const height1x = Math.floor(metadata.height / 2);

  await sharp(sourcePath)
    .resize(width1x, height1x, {
      kernel: 'lanczos3',
      withoutEnlargement: true,
    })
    .webp({ ...WEBP_OPTIONS, alphaQuality: hasAlpha ? WEBP_OPTIONS.alphaQuality : undefined })
    .toFile(output1x);

  // Get file stats
  const stats2x = statSync(output2x);
  const stats1x = statSync(output1x);
  const meta2x = await sharp(output2x).metadata();
  const meta1x = await sharp(output1x).metadata();

  return {
    '@2x': {
      path: output2x,
      width: meta2x.width,
      height: meta2x.height,
      size: stats2x.size,
    },
    '@1x': {
      path: output1x,
      width: meta1x.width,
      height: meta1x.height,
      size: stats1x.size,
    },
  };
}

/**
 * Extract base name from filename (remove __master.png suffix)
 */
function getBaseName(filename) {
  return filename.replace(/__master\.png$/, '').replace(/\.png$/, '');
}

/**
 * Convert filename to manifest key (snake_case to camelCase-like key)
 * Example: menu_gyudon__master.png -> menu_gyudon
 */
function getManifestKey(baseName) {
  return baseName;
}

// ============================================================================
// Manifest Generation
// ============================================================================

/**
 * Update manifest.ts with generated assets
 */
function updateManifest(groupConfig, generatedAssets) {
  const manifestPath = join(projectRoot, groupConfig.manifestPath);

  if (!existsSync(manifestPath)) {
    console.error(`Manifest file not found: ${manifestPath}`);
    process.exit(1);
  }

  let content = readFileSync(manifestPath, 'utf-8');

  const startMarker = `// AUTO-GENERATED:${groupConfig.manifestKey} (do not edit)`;
  const endMarker = `// END AUTO-GENERATED:${groupConfig.manifestKey}`;

  // Generate the manifest block
  const manifestEntries = Object.entries(generatedAssets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, assetData]) => {
      // Use base name without @2x suffix - Metro auto-selects @1x/@2x/@3x variants
      const rawPath = relative(
        join(projectRoot, 'app/src/assets'),
        assetData['@2x'].path
      );
      const relativePath = rawPath.replace(/\\/g, '/').replace(/@2x\.webp$/, '.webp');
      console.log(`  [DEBUG] Key: ${key}, Raw: ${rawPath}, Final: ${relativePath}`);
      return `  "${key}": require("${relativePath}"),`;
    })
    .join('\n');

  const manifestBlock = `export const ${groupConfig.manifestKey} = {\n${manifestEntries}\n} as const;`;

  const fullBlock = `${startMarker}\n${manifestBlock}\n${endMarker}`;

  console.log('[DEBUG] Full block to write:');
  console.log(fullBlock);

  // Check if markers exist
  const hasStartMarker = content.includes(startMarker);
  const hasEndMarker = content.includes(endMarker);

  if (hasStartMarker && hasEndMarker) {
    // Replace existing block
    // Escape regex special characters in markers
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}`,
      'g'
    );
    content = content.replace(regex, fullBlock);
  } else if (!hasStartMarker && !hasEndMarker) {
    // Append at end of file
    content = content.trimEnd() + '\n\n' + fullBlock + '\n';
  } else {
    console.error(`Manifest markers are incomplete. Found start: ${hasStartMarker}, end: ${hasEndMarker}`);
    process.exit(1);
  }

  writeFileSync(manifestPath, content, 'utf-8');
  console.log(`\n✓ Updated ${groupConfig.manifestPath}`);
}

// ============================================================================
// Main
// ============================================================================

async function processGroup(groupName, groupConfig) {
  console.log(`\n📦 Processing ${groupName}...`);

  // Find source files
  const sourcePattern = join(projectRoot, groupConfig.source);
  const sourceFiles = await fg(sourcePattern);

  if (sourceFiles.length === 0) {
    console.warn(`⚠ No source files found: ${sourcePattern}`);
    return;
  }

  console.log(`Found ${sourceFiles.length} source file(s)`);

  // Ensure output directory exists
  const outputDir = join(projectRoot, groupConfig.output);
  mkdirSync(outputDir, { recursive: true });

  // Process each source file
  const generatedAssets = {};
  const summary = [];

  for (const sourcePath of sourceFiles) {
    const filename = sourcePath.split(/[/\\]/).pop();
    const baseName = getBaseName(filename);
    const manifestKey = getManifestKey(baseName);

    console.log(`  Processing: ${filename}`);

    try {
      const assets = await generateWebPAssets(sourcePath, outputDir, baseName);
      generatedAssets[manifestKey] = assets;

      summary.push({
        key: manifestKey,
        '@2x': assets['@2x'],
        '@1x': assets['@1x'],
      });
    } catch (error) {
      console.error(`  ✗ Error processing ${filename}:`, error.message);
      process.exit(1);
    }
  }

  // Update manifest
  updateManifest(groupConfig, generatedAssets);

  // Print summary table
  console.log('\n📊 Summary:');
  console.log('┌─────────────────────────────┬──────────────┬──────────────┬─────────────┐');
  console.log('│ Key                         │ @2x          │ @1x          │ Total Size  │');
  console.log('├─────────────────────────────┼──────────────┼──────────────┼─────────────┤');

  let totalSize = 0;
  for (const item of summary) {
    const size2x = (item['@2x'].size / 1024).toFixed(1);
    const size1x = (item['@1x'].size / 1024).toFixed(1);
    const itemTotal = item['@2x'].size + item['@1x'].size;
    totalSize += itemTotal;
    const itemTotalKB = (itemTotal / 1024).toFixed(1);

    const key = item.key.padEnd(27);
    const dim2x = `${item['@2x'].width}×${item['@2x'].height}`.padEnd(12);
    const dim1x = `${item['@1x'].width}×${item['@1x'].height}`.padEnd(12);
    const total = `${itemTotalKB} KB`.padEnd(11);

    console.log(`│ ${key} │ ${dim2x} │ ${dim1x} │ ${total} │`);
  }

  console.log('├─────────────────────────────┼──────────────┼──────────────┼─────────────┤');
  const totalKB = (totalSize / 1024).toFixed(1);
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`│ Total                       │              │              │ ${totalKB.padEnd(11)} │`);
  console.log(`└─────────────────────────────┴──────────────┴──────────────┴─────────────┘`);
  console.log(`\n✓ Generated ${summary.length * 2} files (${totalMB} MB total)`);
}

async function main() {
  const args = process.argv.slice(2);
  const groupArg = args.find(arg => arg.startsWith('--group='))?.split('=')[1] ||
                   (args.includes('--group') && args[args.indexOf('--group') + 1]);

  const groupsToProcess = groupArg
    ? [groupArg]
    : Object.keys(ASSET_GROUPS);

  for (const groupName of groupsToProcess) {
    if (!ASSET_GROUPS[groupName]) {
      console.error(`Unknown asset group: ${groupName}`);
      console.error(`Available groups: ${Object.keys(ASSET_GROUPS).join(', ')}`);
      process.exit(1);
    }

    await processGroup(groupName, ASSET_GROUPS[groupName]);
  }

  console.log('\n✨ Done!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});

