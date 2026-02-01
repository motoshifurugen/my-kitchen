# World Assets

This directory contains 2.5D kitchen world assets.

## Directory Structure

```
assets/
├── base/
│   └── kitchen/
│       └── base@2x.webp           # Base kitchen background
│
├── overlays/
│   ├── time/
│   │   ├── early-morning@2x.png   # 4:00-6:00
│   │   ├── morning@2x.png         # 6:00-10:00
│   │   ├── day@2x.png             # 10:00-16:00
│   │   ├── evening@2x.png         # 16:00-19:00
│   │   ├── night@2x.png           # 19:00-23:00
│   │   └── late-night@2x.png      # 23:00-4:00
│   │
│   └── season/
│       ├── spring@2x.png          # March-May
│       ├── summer@2x.png          # June-August
│       ├── autumn@2x.png          # September-November
│       └── winter@2x.png          # December-February
│
├── props/
│   ├── age/
│   │   ├── young@2x.webp          # 20-30s style props
│   │   ├── adult@2x.webp          # 40-50s style props
│   │   └── mature@2x.webp         # 60+ style props
│   │
│   └── household/
│       ├── solo@2x.webp           # Single person household
│       └── family@2x.webp         # Family household
│
└── ambient/
    ├── steam_01@2x.webp           # Steam animation frame/loop
    ├── steam_02@2x.webp           # Steam variation
    └── light_dust@2x.webp         # Floating dust particles
```

## Asset Specifications

### Base Kitchen
- **Format:** WebP (or PNG for transparency)
- **Size:** Full screen (390×844pt @2x = 780×1688px)
- **Content:** Kitchen background with all fixed elements

### Time Overlays
- **Format:** PNG with transparency
- **Size:** Full screen
- **Purpose:** Color grading overlay for time-of-day lighting
- **Blending:** Normal mode + opacity (pre-baked effect)

### Season Overlays
- **Format:** PNG with transparency
- **Size:** Full screen
- **Purpose:** Subtle seasonal color tinting
- **Blending:** Normal mode + opacity (pre-baked effect)

### Props
- **Format:** WebP with transparency
- **Size:** Variable (see 05-2_5d-asset-spec.md for limits)
- **Purpose:** Decorative items that change based on user signals

### Ambient
- **Format:** WebP or Lottie JSON for animations
- **Size:** Variable
- **Purpose:** Steam, light rays, dust particles

## Resolution Targets

| Scale | Usage |
|-------|-------|
| @1x   | Low-spec devices |
| @2x   | Standard (default) |
| @3x   | High-resolution displays |

## Integration

Assets are referenced via `src/assets/manifest.ts`.

To add real assets:
1. Place files in the appropriate directory
2. Update the manifest to use `require()` instead of placeholder URI
3. Ensure naming matches the expected pattern

Example:
```typescript
// Before (placeholder)
kitchen: { uri: 'data:...' }

// After (real asset)
kitchen: require('../../assets/base/kitchen/base@2x.webp')
```

## See Also

- `docs/ux/phase-1/05-2_5d-asset-spec.md` - Full asset specification
- `docs/ux/phase-1/06-lighting-spec.md` - Time/season overlay specs
