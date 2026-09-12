"use client";

import { AnimatePresence, motion } from "framer-motion";

// Fullscreen celebratory burst shown on level-up.
export function LevelUpBurst({
  level,
  onDone,
}: {
  level: number | null;
  onDone: () => void;
}) {
  const particles = Array.from({ length: 18 });

  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
          role="alertdialog"
          aria-label={`Level up! You reached level ${level}`}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)" }}
          />

          {/* particles */}
          {particles.map((_, i) => {
            const angle = (i / particles.length) * Math.PI * 2;
            const dist = 160 + (i % 3) * 40;
            return (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                aria-hidden
              >
                {i % 2 === 0 ? "✨" : "⭐"}
              </motion.span>
            );
          })}

          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.4, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
          >
            <div className="font-pixel text-3xl accent sm:text-5xl">
              LEVEL UP!
            </div>
            <motion.div
              className="mt-4 inline-flex h-24 w-24 items-center justify-center rounded-2xl font-pixel text-4xl"
              style={{
                background:
                  "linear-gradient(160deg, var(--accent), color-mix(in srgb, var(--accent) 45%, black))",
                color: "#0b0710",
                boxShadow: "0 0 40px -4px var(--glow)",
              }}
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.6 }}
            >
              {level}
            </motion.div>
            <p className="mt-4 text-sm muted">Tap anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
