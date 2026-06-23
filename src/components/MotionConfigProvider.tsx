"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";

export default function MotionConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={
        shouldReduceMotion
          ? {
              duration: 0,
            }
          : {
              type: "spring",
              stiffness: 260,
              damping: 24,
            }
      }
    >
      {children}
    </MotionConfig>
  );
}