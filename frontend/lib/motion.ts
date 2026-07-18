/** Shared motion tokens — mirrors globals.css keyframes/easings. */
import type { Transition, Variants } from "motion/react";

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutExpo: [0.87, 0, 0.13, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
};

export const dur = {
  interaction: 0.2,
  structural: 0.45,
  navigation: 0.8,
  cinematic: 1.4,
};

export const springs = {
  soft: { type: "spring", stiffness: 120, damping: 18 } as Transition,
  crisp: { type: "spring", stiffness: 260, damping: 22 } as Transition,
  bouncy: { type: "spring", stiffness: 320, damping: 14 } as Transition,
};

export const rise: Variants = {
  hidden: { y: 24, opacity: 0, filter: "blur(6px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: dur.structural, ease: ease.outExpo },
  },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

export const fadeUp: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: ease.outExpo } },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.92, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.55, ease: ease.outExpo },
  },
};
