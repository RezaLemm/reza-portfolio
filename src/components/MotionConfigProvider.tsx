"use client";

import type {ReactNode} from "react";
import {MotionConfig} from "framer-motion";

type MotionConfigProviderProps = {
  children: ReactNode;
};

export default function MotionConfigProvider({
  children,
}: MotionConfigProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 24,
        mass: 0.9,
      }}
    >
      {children}
    </MotionConfig>
  );
}