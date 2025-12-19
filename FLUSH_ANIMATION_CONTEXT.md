# Flush Animation & Optimization Context

## Overview
This document outlines the technical implementation, optimization tiers, and state machine logic for the "Flush" animation in the Hero section (`Hero.tsx`) and related performance fixes in the Evervault background (`evervault-background.tsx`).

## 1. Animation Logic & State Machine

The Hero effect follows a 3-phase state machine to ensure a smooth loading experience:

### Phases
1.  **Loading** (`loading`)
    *   **State**: Initial load.
    *   **Visual**: Standard pulsing beam.
    *   **Duration**: 0s -> 4s.
2.  **Flushing** (`flushing`)
    *   **State**: "Explosion" or rapid expansion outward.
    *   **Visual**: Dots expand outward (`expansion` -> 4.0), Opacity drops to 0, Speed increases.
    *   **Trigger**: `setTimeout` at 4000ms.
    *   **Goal**: Clear the screen for content entry.
3.  **Idle** (`idle`)
    *   **State**: Stable, interactive background.
    *   **Visual**: Returns to standard beam parameters, opacity restored.
    *   **Trigger**: `setTimeout` at 4800ms.

### State Transitions (Lerp)
All parameters are interpolated using a linear interpolation (Lerp) with a factor of `0.04` per frame for smooth transitions.

```typescript
// Target values based on phase
if (animationPhase === 'flushing') {
  targetAmp = 3.5;       // High wave activity
  targetSpeed = 1.2;     // Fast movement
  targetOpacity = 0.0;   // Fade out
  targetExpansion = 4.0; // PUSH OUTWARD
} else if (animationPhase === 'idle') {
  targetAmp = 0.8;
  targetSpeed = 0.4;
  targetOpacity = tier === 'flagship' ? 0.85 : 1.0;
  targetExpansion = 0;
}
```

## 2. Optimization Tiers (Mobile vs Desktop)

We use a tiered system (`usePerformanceTier`) to adapt quality settings.

### Tier 1 Optimizations (General)
*   **Hoisted Allocations**: `Matrix4` and `Vector3` created once outside the render loop.
*   **Pre-computed Constants**: `TWO_PI`, `speed`, `amp`, etc., calculated ahead of time.
*   **Throttling**: Scroll listeners and IntersectionObservers are throttled/granularized.

### Tier 2 Optimizations (Flagship Mobile)
Implemented in `TIER_CONFIG` for `flagship` tier:
*   **Resolution**: `pixelRatio` capped at **1.0** (down from 1.5/2.0).
*   **Geometry**: Segments reduced from 4 to **3** (triangular dots), which look consistent with bloom.
*   **Precision**: forced to `'mediump'` for fragment shaders.
*   **Buffer Access**: Bypassed `setMatrixAt` overhead by writing directly to `instanceMatrix.array` (Float32Array).
*   **Bloom**: Reduced resolution/strength for mobile.

### Code Hook: Direct Buffer Manipulation
```typescript
// Faster than setMatrixAt(i, matrix)
const offset = i * 16;
matrixArray[offset + 12] = px; // Update X translation
matrixArray[offset + 13] = py; // Update Y translation
dots.instanceMatrix.needsUpdate = true;
```

## 3. Component Context

### `Hero.tsx`
*   **`BeamBackground`**: The main WebGL implementation using Three.js.
*   **`MobileBeam`**: A fallback/simpler component for lower tiers (Medium/Low).
*   **Logic**: Handles the flush timer and state transitions.

### `evervault-background.tsx`
*   **Fixes**:
    *   Granular `IntersectionObserver` thresholds `[0, 0.1, 0.5, 0.9, 1]` for better visibility tracking.
    *   Throttled scroll listener to update bounds references without layout thrashing.

## 4. Visual Diagrams

**Loading via Flush Sequence:**
```ascii
[ Loading ]  -->  [ Flushing ]  -->  [ Idle ]
(Pulse)           (Explode Out)      (Calm)
   *                 *     *            *
  ***               *       *          ***
   *               *         *          *
Time: 0s           4.0s              4.8s
Opacity: 1.0       0.0               0.85 (Fade In)
Expansion: 0       4.0               0.0
```

## 5. Next Steps
*   Monitor FPS on older Android devices (non-flagship) to see if 'medium' tier needs adjustments.
*   Responsiveness tuning: Ensure the `expansion` parameter scales correctly with screen aspect ratio (currently hardcoded logic).
