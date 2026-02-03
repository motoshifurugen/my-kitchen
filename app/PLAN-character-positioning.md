# Character Foot Anchor Calibration Plan

## Problem Statement

- Age20 and Age40 character images have the same internal foot position
- Age10 character image has a different foot position (character appears smaller / feet sit higher within the image)
- Need per-character "foot anchor" calibration while keeping the world floor line consistent

## Architecture

### 1. Coordinate Systems

```
ROOM PIXEL SPACE (e.g., 1080x1920 @2x base)
├── FLOOR_Y = 1400px (example: where the kitchen floor line is)
└── All room elements use this coordinate system

CHARACTER IMAGE SPACE (per-age)
├── Each character PNG has its own pixel dimensions
├── CHAR_FOOT_Y[age] = Y coordinate in the character image where feet touch floor
└── age10 foot Y differs from age20/age40
```

### 2. Constants Definition

```typescript
// src/constants/worldLayout.ts

// Room dimensions (measured from @2x kitchen_time assets)
export const ROOM = {
  WIDTH: 1536,   // Base room width in pixels (@2x)
  HEIGHT: 2784,  // Base room height in pixels (@2x)
  FLOOR_Y: 2200, // Y coordinate of floor line in room space (TO BE CALIBRATED)
} as const;

// Character image dimensions (measured from @2x character assets)
export const CHARACTER = {
  WIDTH: 768,    // Character image width (@2x)
  HEIGHT: 1392,  // Character image height (@2x)
} as const;

// Per-age foot anchor Y position (in character image pixel space)
// This is the Y coordinate in the character image where the feet touch the floor
export const CHAR_FOOT_Y: Record<AgeGroup, number> = {
  young: 750,   // age10 - feet sit higher in the image (TO BE CALIBRATED)
  adult: 780,   // age20 - feet position (TO BE CALIBRATED)
  mature: 780,  // age40 - same as adult (TO BE CALIBRATED)
} as const;

// Per-age scale multiplier (optional fine-tuning)
export const CHAR_SCALE_MULT: Record<AgeGroup, number> = {
  young: 1.0,   // May need slight adjustment
  adult: 1.0,
  mature: 1.0,
} as const;
```

### 3. Placement Formula

```typescript
// Given container dimensions from useWindowDimensions or onLayout
const containerWidth = layout.width;
const containerHeight = layout.height;

// Calculate scale factor (room-to-screen)
const scale = containerWidth / ROOM.WIDTH;

// Per-age character scale
const charScale = scale * CHAR_SCALE_MULT[ageGroup];

// Character placement (top-left corner of character image)
const characterWidth = CHARACTER.WIDTH * charScale;
const characterHeight = CHARACTER.HEIGHT * charScale;

// Position character so feet land on FLOOR_Y
const characterTop = (ROOM.FLOOR_Y * scale) - (CHAR_FOOT_Y[ageGroup] * charScale);

// Center horizontally
const characterLeft = (containerWidth - characterWidth) / 2;
// OR using room coordinates:
// const characterLeft = (ROOM.WIDTH / 2 - CHARACTER.WIDTH / 2) * scale;
```

### 4. Component Changes

#### 4.1 New File: `src/constants/worldLayout.ts`

Contains all positioning constants.

#### 4.2 New Component: `src/components/world/CharacterLayer.tsx`

Dedicated component for character rendering with positioning logic.

```typescript
interface CharacterLayerProps {
  ageGroup: AgeGroup;
  visible?: boolean;
  devMode?: boolean;
  showFootGuide?: boolean;  // DEV: show foot line guide
  showFloorGuide?: boolean; // DEV: show floor line guide
}
```

Key features:
- Uses `onLayout` to get container dimensions
- Calculates character position using the formula above
- Uses `contentFit="contain"` to preserve aspect ratio
- Positions using absolute positioning with calculated `top` and `left`

#### 4.3 Modified: `src/components/world/WorldScene.tsx`

Replace simple `WorldLayer` for character with new `CharacterLayer`:

```typescript
{/* Layer 2: Character with foot anchor positioning */}
<CharacterLayer
  ageGroup={ageGroup}
  visible={showCharacter}
  devMode={devMode}
  showFootGuide={__DEV__ && showCalibration}
  showFloorGuide={__DEV__ && showCalibration}
/>
```

#### 4.4 Modified: `src/screens/HomeScreen.tsx`

Add dev calibration controls:

```typescript
// DEV: Calibration controls
{__DEV__ && showCalibration && (
  <DevCalibrationPanel
    ageGroup={ageGroup}
    onFloorYChange={(delta) => /* adjust FLOOR_Y */}
    onFootYChange={(age, delta) => /* adjust CHAR_FOOT_Y[age] */}
    onScaleMultChange={(age, delta) => /* adjust CHAR_SCALE_MULT[age] */}
  />
)}
```

### 5. Dev Calibration UI

```
┌─────────────────────────────────────────┐
│ DEV: Character Calibration              │
├─────────────────────────────────────────┤
│ Floor Guide:   ═══════════════════════  │ ← Red line at FLOOR_Y
│ Foot Guide:    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │ ← Green line at computed foot
├─────────────────────────────────────────┤
│ FLOOR_Y: 1400        [−10][−1][+1][+10] │
├─────────────────────────────────────────┤
│ CHAR_FOOT_Y (young): 750  [−][+]        │
│ CHAR_FOOT_Y (adult): 780  [−][+]        │
│ CHAR_FOOT_Y (mature): 780 [−][+]        │
├─────────────────────────────────────────┤
│ CHAR_SCALE_MULT (young): 1.00  [−][+]   │
│ (step: 0.01)                            │
└─────────────────────────────────────────┘
```

Visual guides:
- **Floor line (red)**: Horizontal line at `FLOOR_Y * scale` from top
- **Foot line (green)**: Horizontal line at `characterTop + CHAR_FOOT_Y[age] * charScale`

When calibrated correctly, both lines should overlap.

### 6. Implementation Steps

1. **Measure character images** to get actual dimensions and foot positions
2. **Create `worldLayout.ts`** with initial constants
3. **Create `CharacterLayer.tsx`** with positioning logic
4. **Update `WorldScene.tsx`** to use CharacterLayer
5. **Add calibration UI** to HomeScreen (DEV only)
6. **Calibrate values** using the dev UI
7. **Output final constants** to commit

### 7. Expected Deliverables

After calibration, output these values:

```typescript
// Final calibrated values
export const ROOM = {
  WIDTH: 1080,
  HEIGHT: 1920,
  FLOOR_Y: ???,  // To be determined
} as const;

export const CHARACTER = {
  WIDTH: ???,    // Measured from @2x assets
  HEIGHT: ???,   // Measured from @2x assets
} as const;

export const CHAR_FOOT_Y: Record<AgeGroup, number> = {
  young: ???,    // Calibrated
  adult: ???,    // Calibrated
  mature: ???,   // Calibrated (expected same as adult)
} as const;

export const CHAR_SCALE_MULT: Record<AgeGroup, number> = {
  young: ???,    // Calibrated (may be 1.0)
  adult: 1.0,
  mature: 1.0,
} as const;
```

### 8. Implementation Status

**IMPLEMENTED** - The following files were created/modified:

| File | Status | Description |
|------|--------|-------------|
| `src/constants/worldLayout.ts` | ✅ CREATED | Positioning constants and helper functions |
| `src/constants/index.ts` | ✅ CREATED | Constants export index |
| `src/components/world/CharacterLayer.tsx` | ✅ CREATED | Character positioning component |
| `src/components/world/WorldScene.tsx` | ✅ MODIFIED | Uses CharacterLayer, added guide props |
| `src/components/world/index.ts` | ✅ MODIFIED | Exports CharacterLayer |
| `src/screens/HomeScreen.tsx` | ✅ MODIFIED | Added calibration guide toggle |

### 9. Current Calibration Values (TO BE FINE-TUNED)

```typescript
// Room dimensions (@2x, measured from kitchen_time assets)
ROOM.WIDTH = 1536
ROOM.HEIGHT = 2784
ROOM.FLOOR_Y = 2200  // ← NEEDS CALIBRATION

// Character dimensions (@2x, measured from character assets)
CHARACTER.WIDTH = 768
CHARACTER.HEIGHT = 1392

// Per-age foot anchor Y positions (@2x, in character image space)
CHAR_FOOT_Y.young = 1200   // ← NEEDS CALIBRATION (age10 feet sit higher)
CHAR_FOOT_Y.adult = 1350   // ← NEEDS CALIBRATION
CHAR_FOOT_Y.mature = 1350  // (same as adult)

// Per-age scale multipliers (default 1.0)
CHAR_SCALE_MULT.young = 1.0
CHAR_SCALE_MULT.adult = 1.0
CHAR_SCALE_MULT.mature = 1.0
```

**To calibrate:**
1. Run the app in development mode
2. Enable "Calibration Guides" toggle in the dev panel
3. Red line = FLOOR_Y (floor line)
4. Green line = computed foot position
5. Adjust constants in `src/constants/worldLayout.ts` until lines overlap
6. Switch between ages to verify all feet land on the same line

### 10. Verification Checklist

- [ ] All ages stand on the exact same FLOOR_Y line
- [ ] Switching time of day does not alter character alignment
- [ ] Switching age keeps feet planted on floor line
- [ ] Age10 character appears correctly sized relative to age20/age40
- [ ] No visual "floating" or "sinking" of characters
- [ ] Guide lines overlap when properly calibrated

### 9. File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/constants/worldLayout.ts` | CREATE | Positioning constants |
| `src/components/world/CharacterLayer.tsx` | CREATE | Character positioning component |
| `src/components/world/WorldScene.tsx` | MODIFY | Use CharacterLayer |
| `src/components/world/index.ts` | MODIFY | Export CharacterLayer |
| `src/screens/HomeScreen.tsx` | MODIFY | Add calibration UI (DEV) |
