# Flush-Out Animation Design Context

## Project: montjeffrey.dev Portfolio
## Component: Hero.tsx BeamBackground

---

## Current State

The Hero section features a Three.js-based dot grid animation with a circular sine wave pattern that creates a pulsing "beam" effect during page load.

### Animation Parameters (Hero.tsx lines 206-211)
```javascript
const TWO_PI = Math.PI * 2;
const speed = 0.4;      // Wave propagation speed
const amp = 0.8;        // Wave amplitude (how much dots expand/contract)
const freq = 0.25;      // Wave oscillation frequency
const falloff = 0.04;   // How quickly wave decays with distance from center
```

### Wave Formula (line 239)
```javascript
const k = 1 + Math.sin(TWO_PI * tt * freq) * amp;
// k is the scale factor applied to each dot's position
// k oscillates between (1 - amp) and (1 + amp), i.e., 0.2 to 1.8
```

### Current Timeline
- **0s - 5s**: Wave animation plays (loading/splash state)
- **5s**: Content fades in via `contentVisible` state
- No transition animation between loading and content states

---

## Desired Behavior

User Request: "I want the initial loading beam to play into the bloom effect... and have the dots flush out of the beam before transitioning into the current bloom effect."

### Chosen Style: Option A - Expand Outward and Fade

The dots should:
1. **Accelerate outward** - amplitude increases dramatically
2. **Fade out** - opacity decreases as dots expand
3. **Settle into idle** - calm background state for content viewing

---

## Technical Implementation Hooks

### Animation Phase State Machine

Add to Hero.tsx:
```typescript
type AnimationPhase = 'loading' | 'flushing' | 'idle';
const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('loading');
```

### Phase Timing (Suggested)
- `loading`: 0s - 4.5s (current wave animation)
- `flushing`: 4.5s - 5s (500ms transition)
- `idle`: 5s+ (calm background, content visible)

### Flush Animation Parameters to Design

| Parameter | Loading Value | Flush Target | Notes |
|-----------|---------------|--------------|-------|
| `amp` | 0.8 | 2.0 - 3.0 | How far dots expand outward |
| `speed` | 0.4 | 1.0 - 2.0 | How fast the flush happens |
| `material.opacity` | 0.85 | 0.0 - 0.3 | Fade out during flush |
| `falloff` | 0.04 | 0.02 - 0.01 | Wave reaches edges faster |

### Idle State Options

After flush completes, the grid can either:
1. **Fully hidden** - opacity = 0, animation stops
2. **Subtle ambient** - very low amplitude (0.1), slow movement
3. **Static grid** - no animation, just faint dots as texture

---

## Code Location for Implementation

### File: `components/Hero.tsx`

**Add phase state** near line 313:
```typescript
const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('loading');
```

**Add phase timers** near line 322-327:
```typescript
useEffect(() => {
  const flushTimer = setTimeout(() => setAnimationPhase('flushing'), 4500);
  const idleTimer = setTimeout(() => setAnimationPhase('idle'), 5000);
  return () => {
    clearTimeout(flushTimer);
    clearTimeout(idleTimer);
  };
}, []);
```

**Modify animate() function** (lines 213-251):
- Pass `animationPhase` into the animation logic
- Interpolate parameters based on phase
- Use `THREE.MathUtils.lerp()` for smooth transitions

### Example Flush Logic
```typescript
function animate() {
  // ... existing frame throttling ...

  const t = clock.getElapsedTime();

  let currentAmp = amp;
  let currentSpeed = speed;
  let currentOpacity = 0.85;

  if (animationPhase === 'flushing') {
    // Calculate flush progress (0 to 1 over 500ms)
    const flushProgress = Math.min(1, (t - flushStartTime) / 0.5);

    // Ease out for dramatic effect
    const eased = 1 - Math.pow(1 - flushProgress, 3);

    currentAmp = THREE.MathUtils.lerp(0.8, 2.5, eased);
    currentSpeed = THREE.MathUtils.lerp(0.4, 1.5, eased);
    currentOpacity = THREE.MathUtils.lerp(0.85, 0.2, eased);

    material.opacity = currentOpacity;
  } else if (animationPhase === 'idle') {
    // Calm state - very subtle or no animation
    currentAmp = 0.1;
    currentOpacity = 0.3;
    material.opacity = currentOpacity;
  }

  // ... rest of animation loop using currentAmp, currentSpeed ...
}
```

---

## Visual Reference

### Loading Phase (0-4.5s)
```
     · · · · ·
   ·   ·   ·   ·
  · · ·[PULSE]· · ·   <- Dots expand/contract in waves from center
   ·   ·   ·   ·
     · · · · ·
```

### Flushing Phase (4.5-5s)
```
  ·       ·       ·
    ·           ·
·       [BURST]       ·   <- Dots rapidly expand outward, fading
    ·           ·
  ·       ·       ·
```

### Idle Phase (5s+)
```
  ·   ·   ·   ·   ·
  ·   ·   ·   ·   ·
  ·   ·   ·   ·   ·       <- Calm grid, very subtle or no movement
  ·   ·   ·   ·   ·
  ·   ·   ·   ·   ·
```

---

## Design Decisions Needed

1. **Flush Duration**: 500ms? 750ms? 1s?
2. **Easing Curve**: Linear, ease-out, elastic, or custom?
3. **Final Amplitude**: Should idle state have any movement?
4. **Final Opacity**: How visible should the grid be behind content?
5. **Bloom Interaction**: Should bloom intensity change during flush?
6. **Sound/Haptics**: Any audio or haptic feedback? (optional)

---

## Files of Interest

- `components/Hero.tsx` - Main implementation
- `components/hero/MobileBeam.tsx` - May need parallel implementation for consistency
- `hooks/use-performance-tier.ts` - Tier detection (affects which component renders)

---

## Performance Considerations

- Flush animation is brief (500ms) so performance impact is minimal
- Avoid creating new objects during flush (already optimized)
- Consider skipping flush on low-tier devices (use MobileBeam's simpler fade)
