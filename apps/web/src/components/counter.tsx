import { useInView, useMotionValue, useSpring } from "framer-motion";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

type CounterProps = {
  value: number;
  digits?: number;
  direction?: "up" | "down";
  delay?: number;
} & ComponentPropsWithoutRef<"span">;

const MILLISECONDS_PER_SECOND = 1000 as const;

export default function Counter({
  value,
  className,
  digits = 0,
  direction = "up",
  delay = 0,
  ...props
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * MILLISECONDS_PER_SECOND);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            notation: "compact",
          }).format(Number(latest.toFixed(digits)));
        }
      }),
    [springValue, digits]
  );

  return (
    <span ref={ref} {...props}>
      {value}
    </span>
  );
}
