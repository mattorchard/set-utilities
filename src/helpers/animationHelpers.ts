export const duringAnimation = (duration: number, callback: () => void) => {
  const endTime = Date.now() + duration;

  const rafLoop = () => {
    if (endTime <= Date.now()) return;
    requestAnimationFrame(rafLoop);
    callback();
  };
  requestAnimationFrame(rafLoop);
};
