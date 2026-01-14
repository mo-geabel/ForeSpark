import { motion } from "framer-motion";
import { useState } from "react";

type RevealProps = {
  children: React.ReactNode | ((visible: boolean) => React.ReactNode);
  delay?: number;
  duration?: number;
  ease?: "easeOut" | "easeIn" | "easeInOut" | "linear";
  slide?:"x" | "y"
};

export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  ease = "easeOut",
  slide = "y"
}: RevealProps) {
  const [visible, setVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, [slide]: 40 }}
      whileInView={{ opacity: 1, [slide]: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, ease, delay }}
      onViewportEnter={() => setVisible(true)}

    >
      {typeof children === "function" ? children(visible) : children}
    </motion.div>
  );
}
