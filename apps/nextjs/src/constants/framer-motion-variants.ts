import type { Variants } from "framer-motion";

const slideInWithFadeOut: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.1, ease: "backOut" },
  },
};

export { slideInWithFadeOut };
