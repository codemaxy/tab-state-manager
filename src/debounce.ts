export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastArgs: Parameters<T>;

  const later = () => {
    timeoutId = undefined as any;
    func.apply(null, lastArgs);
  };

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);
  };
}
