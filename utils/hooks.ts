import { useEffect, useState } from 'react';

declare const window: Window;

export function useDarkThemeIsPreferred() {
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(false);

  useEffect(() => {
    const callback = (e: MediaQueryListEvent) => {
      setDarkThemeEnabled(e.matches);
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', callback);

    // Now mounted, so window should def be available
    setDarkThemeEnabled(
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', callback);
    };
  }, []);

  return darkThemeEnabled;
}
