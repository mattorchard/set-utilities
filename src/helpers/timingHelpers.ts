export const debounce = <T extends Array<any>, R>(
  callback: (...args: T) => R,
  delayAmount: number
) => {
  let timeoutId: number | null = null;
  return (...args: T) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delayAmount);
  };
};
