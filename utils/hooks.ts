import { useEffect, useState } from 'react';

// Hooks should only ever run on the client
declare const window: Window;

export function useDarkThemeIsPreferred() {
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const callback = (e: MediaQueryListEvent) => {
      setDarkThemeEnabled(e.matches);
    };
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', callback);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', callback);
    };
  }, []);
  return darkThemeEnabled;
}
