import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low';

export function usePerformanceTier(): PerformanceTier {
    const [tier, setTier] = useState<PerformanceTier>('high');

    useEffect(() => {
        // Detect mobile/tablet
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Simple heuristic for "Low End"
        // If logical processors <= 4, likely an older or budget device
        const concurrency = navigator.hardwareConcurrency || 4;

        if (isMobile) {
            if (concurrency <= 4) {
                setTier('low');
            } else {
                setTier('medium'); // Modern mobile
            }
        } else {
            // Desktop
            setTier('high');
        }
    }, []);

    return tier;
}
