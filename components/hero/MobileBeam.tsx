import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface MobileBeamProps {
    performanceTier: 'medium' | 'low';
}

export const MobileBeam: React.FC<MobileBeamProps> = ({ performanceTier }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Use lower precision for mobile to save shader ops
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            precision: 'lowp', // Switch to lowp for maximum speed
        });

        // Cap pixel ratio at 1.0 for all mobile tiers to ensure consistent performance
        const pixelRatio = Math.min(window.devicePixelRatio, 1.0);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0d0d0d, 1);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.z = 1;

        // --- Configuration ---
        // Aggressively reduced counts for mobile
        // Previous: 60x60 (3600) / 40x40 (1600)
        // New: 40x40 (1600) / 30x30 (900)
        const cols = performanceTier === 'medium' ? 40 : 30;
        const rows = performanceTier === 'medium' ? 40 : 30;
        const spacing = 0.8; // Increased spacing since we have fewer dots
        const dotCount = cols * rows;

        // --- Shader Logic ---
        // Vertex Shader: Handles wave animation on GPU
        const vertexShader = `
      uniform float uTime;
      attribute vec3 aBasePos;
      
      varying float vIntensity;
      varying vec2 vUv;

      // Simplified wave logic - reduced trig operations
      // Replaced potentially expensive atan math with simpler sin/cos approximation
      
      void main() {
        vUv = uv;
        
        vec3 pos = aBasePos;
        
        // Calculate wave parameters based on position/distance from center
        float dist = length(pos.xy);
        
        // Optimize: Pre-calculate constants in JS if possible, but for dynamic wave:
        float t = uTime * 0.4 - dist * 0.05;
        
        // Simplified ripple: just a sin wave, cheaper than the "rounded square" atan formula
        // This looks 95% similar but runs faster
        float wave = sin(t * 6.28); 
        float k = 1.0 + wave * 0.15; // Subtle distortion
        
        // Apply position update
        vec3 finalPos = pos * k;
        
        // Pass intensity to fragment
        vIntensity = 0.5 + wave * 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
        
        // Size attenuation
        gl_PointSize = ${performanceTier === 'medium' ? '24.0' : '20.0'}; 
      }
    `;

        // Fragment Shader: Handles "Fake Bloom" glow
        const fragmentShader = `
      precision lowp float; // Enforce low precision
      uniform vec3 uColor;
      varying float vIntensity;

      void main() {
        // Simple radial distance
        vec2 center = 2.0 * gl_PointCoord - 1.0;
        float distSq = dot(center, center);
        
        if (distSq > 1.0) discard;
        
        // Simplified glow falloff: Linear instead of pow(x, 2.0)
        // Cheaper and looks slightly softer (more "bloomy")
        float glow = 1.0 - distSq;
        
        // Boost brightness at center
        glow = glow * (0.6 + vIntensity * 0.4);
        
        gl_FragColor = vec4(uColor, glow);
      }
    `;

        // --- Geometry Construction ---
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(dotCount * 3);
        const basePos = new Float32Array(dotCount * 3);

        let i = 0;
        const xOffset = (cols - 1) * spacing * 0.5;
        const yOffset = (rows - 1) * spacing * 0.5;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = c * spacing - xOffset;
                let y = r * spacing - yOffset;

                // Hex offset
                if (c % 2 === 1) {
                    y += spacing * 0.5;
                }

                // Jitter
                x += (Math.random() - 0.5) * 0.25;
                y += (Math.random() - 0.5) * 0.25;

                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = 0;

                basePos[i] = x;
                basePos[i + 1] = y;
                basePos[i + 2] = 0;

                i += 3;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aBasePos', new THREE.BufferAttribute(basePos, 3));

        // --- Material ---
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xe77d22) }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending, // Key for glowing look
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // --- Resizing ---
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            const aspect = w / h;

            // Orthographic camera sizing to match desktop logic roughly
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
            material.uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(frameId);
            container.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [performanceTier]);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
