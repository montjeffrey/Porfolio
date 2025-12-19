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
            precision: 'mediump',
        });

        const pixelRatio = Math.min(window.devicePixelRatio, performanceTier === 'medium' ? 1.5 : 1.0);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0d0d0d, 1);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.z = 1;

        // --- Configuration ---
        // 'medium' tier gets denser grid, 'low' tier gets sparse grid
        const cols = performanceTier === 'medium' ? 60 : 40;
        const rows = performanceTier === 'medium' ? 60 : 40;
        const spacing = 0.6;
        const dotCount = cols * rows;

        // --- Shader Logic ---
        // Vertex Shader: Handles wave animation on GPU
        const vertexShader = `
      uniform float uTime;
      attribute float aOffset;
      attribute vec3 aBasePos;
      
      varying float vIntensity;
      varying vec2 vUv;

      // Rounded square wave logic ported to GLSL
      float roundedSquareWave(float t, float delta, float a, float f) {
        return ((2.0 * a) / 3.14159) * atan(sin(2.0 * 3.14159 * t * f) / delta);
      }

      void main() {
        vUv = uv;
        
        vec3 pos = aBasePos;
        
        // Calculate wave parameters based on position/distance from center
        float dist = length(pos.xy);
        
        // Dynamic wave parameters
        float speed = 0.4;
        float amp = 0.8;
        float freq = 0.25;
        float falloff = 0.04;
        
        float localDelta = mix(0.05, 0.2, min(1.0, dist / 20.0));
        float t = uTime * speed - dist * falloff;
        
        // Apply wave distortion
        float k = 1.0 + roundedSquareWave(t, localDelta, amp, freq);
        
        // Apply position update
        vec3 finalPos = pos * k;
        
        // Pass intensity to fragment for glow pulsing
        // We use the 'k' value to determine how "active" this dot is
        vIntensity = smoothstep(1.0, 1.8, k);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
        
        // Size attenuation (simulating perspective or just variety)
        gl_PointSize = ${performanceTier === 'medium' ? '18.0' : '14.0'}; 
      }
    `;

        // Fragment Shader: Handles "Fake Bloom" glow
        const fragmentShader = `
      uniform vec3 uColor;
      varying float vIntensity;

      void main() {
        // Create soft circular glow
        vec2 center = 2.0 * gl_PointCoord - 1.0;
        float dist = dot(center, center);
        
        // Discard outside circle
        if (dist > 1.0) discard;
        
        // Soft edge (bloom simulation)
        // Power function concentrates opacity in center, fades out to edge
        float glow = 1.0 - dist;
        glow = pow(glow, 2.0); 
        
        // Intensity multiplier from wave
        float brightness = 0.5 + vIntensity * 0.5;
        
        gl_FragColor = vec4(uColor, glow * brightness);
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
