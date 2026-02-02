# KitchenWorld Runtime

2.5D kitchen world layer composition for the home screen.

## Layer Stack (MVP)

```
┌─────────────────────────────┐
│ Layer 4: Mask (future)      │ zIndex: 5
├─────────────────────────────┤
│ Layer 3: Character (static) │ zIndex: 4
├─────────────────────────────┤
│ Layer 2: Time Overlay       │ zIndex: 2-3 (blending)
├─────────────────────────────┤
│ Layer 1: Base Kitchen       │ zIndex: 1
└─────────────────────────────┘
```

## Testing Layer Switching

In development mode (`__DEV__`), the Home Screen shows a floating panel at the bottom:

1. **Time Overlay buttons**: Switch between 6 time-of-day overlays
   - 早朝 (earlyMorning), 朝 (morning), 昼 (day), 夕 (evening), 夜 (night), 深夜 (lateNight)

2. **Character buttons**: Switch between 3 age groups
   - 10代 (young), 20代 (adult), 40代 (mature)

The Settings screen also has a more detailed debug panel with blend controls.

## Adding New Assets

### 1. Create Master File

Place in `docs/ux/phase-1/assets/_source/{category}/`:
```
docs/ux/phase-1/assets/_source/overlays/time/time_dusk__master.png
```

### 2. Generate Runtime Assets

Run the conversion script to create @2x and @1x WebP outputs:
```
# Output to app/assets/overlays/time/
time_dusk@2x.webp  (same size as master)
time_dusk@1x.webp  (50% size)
```

### 3. Add Type Definition (if new enum value)

In `app/src/state/worldSignals.ts`:
```typescript
export type TimeOfDay =
  | 'earlyMorning'
  | 'morning'
  | 'day'
  | 'dusk'        // ← Add new value
  | 'evening'
  // ...

export const TIME_ORDER: TimeOfDay[] = [
  'earlyMorning',
  'morning',
  'day',
  'dusk',         // ← Add to order array
  'evening',
  // ...
];
```

### 4. Register in Manifest

In `app/src/assets/manifest.ts`:
```typescript
overlays: {
  time: {
    // ...
    dusk: require('../../assets/overlays/time/time_dusk@2x.webp'),
    // ...
  },
},
```

### 5. Update Dev Colors (optional)

In `WorldScene.tsx`:
```typescript
const DEV_COLORS = {
  time: {
    // ...
    dusk: 'rgba(255, 180, 120, 0.3)', // Golden pink
  },
};
```

## Naming Convention

| Type | Enum Key | Filename |
|------|----------|----------|
| Time | `earlyMorning` | `time_early_morning@2x.webp` |
| Time | `lateNight` | `time_late_night@2x.webp` |
| Character | `young` | `girl_age10_base@2x.webp` |
| Character | `adult` | `girl_age20_base@2x.webp` |
| Character | `mature` | `girl_age40_base@2x.webp` |

## MVP Constraints

- **@2x only**: No PixelRatio switching yet (always loads @2x assets)
- **Static character**: No frame animation, no breathing motion
- **No ambient loops**: Steam, light dust deferred to post-MVP
- **No season overlay**: Season assets not yet created

## Files

```
app/src/
├── assets/
│   └── manifest.ts          # Asset registry & path helpers
├── components/world/
│   ├── WorldScene.tsx       # Main layer compositor
│   ├── WorldLayer.tsx       # Single layer component
│   └── README.md            # This file
├── state/
│   └── worldSignals.ts      # Time/season/age state (Zustand)
├── utils/
│   ├── time.ts              # Time interpolation helpers
│   └── preload.ts           # Asset preloading
└── screens/
    └── HomeScreen.tsx       # Dev time selector UI
```
