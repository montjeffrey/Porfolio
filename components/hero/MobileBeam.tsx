import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface MobileBeamProps {
    performanceTier: 'medium' | 'low';
}

/**
 * MobileBeam - Optimized for Mobile Performance
 * 
 * Key Optimizations:
 * 1. Precision: Uses 'mediump' instead of 'lowp' to eliminate vertex jitter/swimming while keeping shader cost low.
 * 2. Pre-calculation: Move expensive math (distance, randomness) from Vertex Shader to CPU (Attributes).
 * 3. NO DISCARD: Replaced `discard` in fragment shader with `smoothstep` alpha blending. 
 *    `discard` kills Early-Z performance on tile-based mobile GPUs.
 * 4. Textureless Glow: Procedural soft dots using distance fields, avoiding texture lookups.
 * 5. Reduced Draw Calls: Single Point Cloud draw call.
 * 6. Batching: All uniforms and attributes are efficient.
 */
export const MobileBeam = React.memo<MobileBeamProps>(({ performanceTier }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // --- Renderer Setup ---
        // 'mediump' is the sweet spot. 'lowp' causes visible jitter in position calculations.
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false, // Reverted to FALSE to ensure visibility against CSS background
            powerPreference: 'high-performance',
            precision: 'mediump',
        });

        // Strict pixel ratio cap. 
        // 1.0 is sufficient for this effect on mobile and saves massive fill-rate.
        const pixelRatio = Math.min(window.devicePixelRatio, 1.0);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0d0d0d, 1); // Explicitly set background color to match design
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        // Orthographic Camera allows us to work in "screen space" units easily
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        camera.position.z = 10;

        // --- Configuration ---
        // Balanced density for visual impact vs performance
        // Medium: 1600 dots (40x40) vs Low: 900 dots (30x30)
        // This is extremely light for even 5-year-old phones if shaders are clean.
        const cols = performanceTier === 'medium' ? 40 : 30;
        const rows = performanceTier === 'medium' ? 40 : 30;
        const spacing = 0.8;
        const dotCount = cols * rows;

        // --- Shader Optimizations ---
        // Removed explicit 'precision' line to let Three.js handle it from renderer config

        const vertexShader = `
            uniform float uTime;
            
            attribute vec3 position;
            attribute float aDist;   // Pre-calculated distance from center
            attribute float aRandom; // Pre-calculated variation
            
            varying float vAlpha;
            
            void main() {
                // Wave Logic
                // We use the pre-calculated aDist to offset the wave phase.
                // Simplified Sin wave for motion. Creates the "pulsing" beam effect.
                
                float t = uTime * 0.4 - aDist * 0.08;
                float wave = sin(t * 6.28); 
                
                // Add subtle random movement based on pre-calculated random value
                float randomOffset = sin(uTime + aRandom * 10.0) * 0.02;
                
                // Expansion/Contraction
                // k defines how far the point moves from its original position
                float k = 1.0 + wave * 0.15 + randomOffset;
                
                vec3 newPos = position;
                newPos.x *= k;
                newPos.y *= k;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
                
                // Point Size Management
                // Scale point size inversely with depth (optional, but good for 3D feel in 2D)
                // We keep it uniform here for the "grid" look
                gl_PointSize = ${performanceTier === 'medium' ? '24.0' : '18.0'}; 
                
                // Pass intensity/alpha to fragment
                // Dots in the "trough" of the wave are dimmer
                vAlpha = 0.4 + wave * 0.4;
            }
        `;

        const fragmentShader = `
            uniform vec3 uColor;
            varying float vAlpha;
            
            void main() {
                // Circular Glow Calculation
                // gl_PointCoord goes from (0,0) to (1,1)
                vec2 center = 2.0 * gl_PointCoord - 1.0; // Map to (-1, -1) to (1, 1)
                float distSq = dot(center, center);
                
                // OPTIMIZATION: Soft edge feathering without 'discard'.
                // smoothstep(edge0, edge1, x) returns 0.0 if x >= edge1
                // This means pixels outside the circle become transparent naturally.
                // No branching (if/discard) = Faster on Mobile.
                float circle = 1.0 - smoothstep(0.5, 1.0, distSq);
                
                // Apply color and calculated alpha
                gl_FragColor = vec4(uColor, circle * vAlpha);
            }
        `;

        // --- Geometry & Attribute Buffers ---
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(dotCount * 3);
        const distances = new Float32Array(dotCount);
        const randoms = new Float32Array(dotCount);

        let i = 0;
        let dI = 0;
        const xOffset = (cols - 1) * spacing * 0.5;
        const yOffset = (rows - 1) * spacing * 0.5;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = c * spacing - xOffset;
                let y = r * spacing - yOffset;

                // Hexagonal Shift
                if (c % 2 === 1) {
                    y += spacing * 0.5;
                }

                // Initial Jitter (Static)
                // We add this to the base position so the grid isn't perfectly rigid
                const jitter = 0.25;
                x += (Math.random() - 0.5) * jitter;
                y += (Math.random() - 0.5) * jitter;

                // Position
                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = 0;

                // Pre-calculate Attributes
                // 1. Distance for wave phase (saves sqrt() in shader)
                distances[dI] = Math.sqrt(x * x + y * y);

                // 2. Random value for variety
                randoms[dI] = Math.random();

                i += 3;
                dI++;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aDist', new THREE.BufferAttribute(distances, 1));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        // --- Material ---
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xe77d22) }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending, // Key for the "beam" light look
            depthWrite: false, // No Z-buffer writing needed for additive particles
            depthTest: false   // Disable depth test to save checks (optional, safe here because 2D layer)
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // --- Resize Logic ---
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            const aspect = w / h;

            // Maintain consistent visual scale regardless of aspect ratio
            const worldHeight = 10;
            const worldWidth = worldHeight * aspect;

            camera.left = -worldWidth / 2;
            camera.right = worldWidth / 2;
            camera.top = worldHeight / 2;
            camera.bottom = -worldHeight / 2;

            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize();

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Update time uniform
            // We use simple elapsed time. For very long running tabs, 
            // one might want to mod this, but float precision in JS is fine for days.
            const elapsed = clock.getElapsedTime();
            material.uniforms.uTime.value = elapsed;

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(frameId);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [performanceTier]);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
});

MobileBeam.displayName = 'MobileBeam';
