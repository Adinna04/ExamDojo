import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ trigger, duration = 3000 }) => {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    const colors = ['#16a34a', '#eab308', '#3b82f6', '#ec4899', '#8b5cf6'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst in the middle
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors
      });
    }, 500);

  }, [trigger, duration]);

  return null;
};

export default Confetti;
