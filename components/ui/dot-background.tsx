export function DotBackground() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-bg-elevated pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#F0EDE4_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05]" />
        </div>
    );
}
