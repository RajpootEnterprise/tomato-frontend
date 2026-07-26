import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import './SpotlightCard.css';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 107, 53, 0.15)',
  tilt = true,
  ...props
}) => {
  const divRef = useRef(null);

  // Position ranges from 0 to 1; 0.5 is the center (no rotation)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${clientX}px`);
    divRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);

    if (tilt) {
      x.set(clientX / rect.width);
      y.set(clientY / rect.height);
    }
  };

  const handleMouseLeave = () => {
    if (tilt) {
      x.set(0.5);
      y.set(0.5);
    }
  };

  const Component = tilt ? motion.div : 'div';
  const tiltStyle = tilt
    ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }
    : {};

  return (
    <Component
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-spotlight ${className}`}
      style={{
        ...props.style,
        ...tiltStyle,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default SpotlightCard;

