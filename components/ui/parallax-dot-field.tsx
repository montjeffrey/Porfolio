import { ParallaxLayer } from "@/lib/parallax/scroll-scene";

export function ParallaxDotField() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-bg-elevated">
      <ParallaxLayer
        depth="far"
        className="absolute -inset-[15%] bg-[radial-gradient(var(--text-primary)_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.04]"
      />
      <ParallaxLayer
        depth="mid"
        className="absolute -inset-[15%] bg-[radial-gradient(var(--text-primary)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05]"
      />
      <ParallaxLayer
        depth="near"
        opacityRange={[0.06, 0.14]}
        className="absolute -inset-[15%] bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_65%)]"
      />
    </div>
  );
}
