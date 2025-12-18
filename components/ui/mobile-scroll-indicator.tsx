"use client";

import { motion } from "framer-motion";

export const MobileScrollIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden pointer-events-none z-20"
        >
            <span className="text-[10px] uppercase tracking-[0.2em] text-secondary/60 font-medium">
                Scroll
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 overflow-hidden relative">
                <motion.div
                    className="absolute top-0 left-0 w-full h-1/2 bg-primary"
                    animate={{
                        y: ["-100%", "200%"],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0.5,
                    }}
                />
            </div>
        </motion.div>
    );
};
