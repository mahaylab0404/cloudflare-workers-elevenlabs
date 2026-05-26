import { motion, useReducedMotion } from "motion/react";
import type { Key, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: Key;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 1, y: 22 }}
      transition={{
        delay,
        duration: 0.56,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-12% 0px" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
