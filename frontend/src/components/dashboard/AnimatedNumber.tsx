import React, { useState, useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
}

export default function AnimatedNumber({ 
  value, 
  duration = 800, 
  formatter = (val) => String(Math.round(val)) 
}: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * value);
      
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setCount(value); // ensure final exact value is set
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <>{formatter(count)}</>;
}
