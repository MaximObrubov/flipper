

export function animateByStep(
  from: number,
  to: number,
  duration: number,
  step: (value: number) => void,
) {
  let starttime: number;
  return new Promise<void>((resolve, reject): void => {
    const animate = (timestamp: number) => {
      if (!starttime) starttime = timestamp;

      const runtime = timestamp - starttime;
      const relativeProgress = runtime / duration;
      step(from + (to - from) * Math.min(relativeProgress, 1));

      if (runtime < duration) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(animate);
  });

}
