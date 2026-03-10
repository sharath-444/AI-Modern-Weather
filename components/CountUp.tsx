
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<Props> = ({ value, suffix = '', className = '' }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};
