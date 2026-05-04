'use client';

import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = Exclude<ThemePreference, 'system'>;

const THEME_STORAGE_KEY = 'theme-preference';
const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function resolveTheme(preference: ThemePreference, matchesDarkMode: boolean): ResolvedTheme {
  if (preference === 'system') {
    return matchesDarkMode ? 'dark' : 'light';
  }

  return preference;
}

function applyTheme(preference: ThemePreference, matchesDarkMode: boolean) {
  const resolvedTheme = resolveTheme(preference, matchesDarkMode);
  const root = document.documentElement;

  root.dataset.themePreference = preference;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

function readStoredPreference(): ThemePreference {
  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedValue === 'light' || storedValue === 'dark') {
    return storedValue;
  }

  return 'system';
}

export const themeBootstrapScript = `(() => {
  const storageKey = '${THEME_STORAGE_KEY}';
  const mediaQuery = '${THEME_MEDIA_QUERY}';
  const root = document.documentElement;
  const resolveTheme = (preference, matchesDarkMode) =>
    preference === 'system' ? (matchesDarkMode ? 'dark' : 'light') : preference;

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    const preference = storedValue === 'light' || storedValue === 'dark' ? storedValue : 'system';
    const matchesDarkMode = window.matchMedia(mediaQuery).matches;
    const resolvedTheme = resolveTheme(preference, matchesDarkMode);

    root.dataset.themePreference = preference;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  } catch {
    const matchesDarkMode = window.matchMedia(mediaQuery).matches;
    const resolvedTheme = matchesDarkMode ? 'dark' : 'light';

    root.dataset.themePreference = 'system';
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }
})();`;

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [matchesDarkMode, setMatchesDarkMode] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const currentPreference = readStoredPreference();

    setPreference(currentPreference);
    setMatchesDarkMode(mediaQueryList.matches);
    applyTheme(currentPreference, mediaQueryList.matches);

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setMatchesDarkMode(event.matches);

      if (readStoredPreference() === 'system') {
        applyTheme('system', event.matches);
        setPreference('system');
      }
    };

    mediaQueryList.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  function updatePreference(nextPreference: ThemePreference) {
    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);

    setPreference(nextPreference);
    setMatchesDarkMode(mediaQueryList.matches);

    if (nextPreference === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    }

    applyTheme(nextPreference, mediaQueryList.matches);
  }

  const resolvedTheme = resolveTheme(preference, matchesDarkMode);
  const followsSystem = preference === 'system';
  const nextPreference = resolvedTheme === 'dark' ? 'light' : 'dark';
  const switchLabel = followsSystem
    ? `Theme follows system. Switch to ${nextPreference} mode.`
    : `Theme set to ${resolvedTheme}. Switch to ${nextPreference} mode.`;

  return (
    <div className="theme-control">
      <span className="theme-control-label">Theme</span>
      <button
        aria-checked={resolvedTheme === 'dark'}
        aria-describedby="theme-status"
        aria-label={switchLabel}
        className="theme-switch"
        onClick={() => updatePreference(nextPreference)}
        role="switch"
        type="button"
      >
        <span className="theme-switch-track">
          <span className="theme-switch-thumb" />
        </span>
      </button>
      {followsSystem ? (
        <span className="theme-status" id="theme-status">
          Auto
        </span>
      ) : (
        <button className="theme-reset" id="theme-status" onClick={() => updatePreference('system')} type="button">
          Auto
        </button>
      )}
    </div>
  );
}