import type { Variants } from "framer-motion";

export const premiumEase: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const fastEase: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: premiumEase,
    },
  },
};

export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: premiumEase,
    },
  },
};

export const revealSoft: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.985,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: premiumEase,
    },
  },
};

export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: premiumEase,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

export const slowStaggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.12,
    },
  },
};