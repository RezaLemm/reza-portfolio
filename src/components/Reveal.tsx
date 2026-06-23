"use client";

import { motion, useReducedMotion } from "framer-motion";
import { revealUp } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.18,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}