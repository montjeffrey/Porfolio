import { useState, useEffect } from 'react';

export type PerformanceTier = 'flagship' | 'high' | 'medium' | 'low';

/**
 * Detects device performance tier for adaptive rendering
 *
 * Tiers:
 * - flagship: High-end mobile (iPhone 13 Pro+, S21 Ultra+, Pixel 6 Pro+)
 * - high: Desktop/laptop devices
 * - medium: Mid-range mobile (4-5 cores, 2-3 years old)
 * - low: Budget mobile (≤4 cores, older devices)
 */
export function usePerformanceTier(): PerformanceTier {
    const [tier, setTier] = useState<PerformanceTier>('high');

    useEffect(() => {
        const detectTier = (): PerformanceTier => {
            // Detect mobile/tablet
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            // Hardware concurrency (CPU cores)
            const concurrency = navigator.hardwareConcurrency || 4;

            // GPU Detection via WebGL
            let gpuTier: 'high' | 'medium' | 'low' = 'medium';
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;

                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

                        // High-end mobile GPUs
                        if (/Apple GPU|Apple M[0-9]|A1[5-9] GPU|A[2-9][0-9] GPU/i.test(renderer)) {
                            gpuTier = 'high'; // Apple A15+ or M-series
                        } else if (/Adreno [7-9][0-9]{2}|Mali-G7[0-9]|Mali-G[8-9][0-9]|Immortalis/i.test(renderer)) {
                            gpuTier = 'high'; // Modern Android flagships
                        } else if (/Adreno [5-6][0-9]{2}|Mali-G5[0-9]|Mali-G6[0-9]/i.test(renderer)) {
                            gpuTier = 'medium'; // Mid-range GPUs
                        } else if (/Adreno [0-4][0-9]{2}|Mali-[0-4]/i.test(renderer)) {
                            gpuTier = 'low'; // Budget GPUs
                        }
                    }
                }
            } catch (e) {
                // WebGL not available, fall back to CPU detection
                console.warn('WebGL detection failed, using CPU-based tier detection');
            }

            // Device-specific detection for known flagships
            const userAgent = navigator.userAgent;
            const isFlagshipApple = /iPhone1[3-9]|iPhone[2-9][0-9]|iPad.*Pro.*M[0-9]/i.test(userAgent);
            const isFlagshipSamsung = /SM-S9[0-9]{2}|SM-S2[0-9]{2}/i.test(userAgent); // S21+, S22+, S23+, S24+
            const isFlagshipPixel = /Pixel [6-9].*Pro|Pixel [1-9][0-9].*Pro/i.test(userAgent);

            // Desktop devices
            if (!isMobile) {
                return 'high';
            }

            // Flagship mobile detection
            // Criteria: 6+ cores OR flagship GPU OR known flagship device
            if (
                concurrency >= 6 ||
                gpuTier === 'high' ||
                isFlagshipApple ||
                isFlagshipSamsung ||
                isFlagshipPixel
            ) {
                return 'flagship';
            }

            // Mid-range mobile
            if (concurrency >= 5 || gpuTier === 'medium') {
                return 'medium';
            }

            // Budget mobile
            return 'low';
        };

        const detectedTier = detectTier();
        setTier(detectedTier);

        // Log tier for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Performance Tier]', detectedTier, {
                cores: navigator.hardwareConcurrency,
                userAgent: navigator.userAgent
            });
        }
    }, []);

    return tier;
}
