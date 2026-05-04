'use client';

import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = Exclude<ThemePreference, 'system'>;

const THEME_STORAGE_KEY = 'theme-preference';
const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

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

  useEffect(() => {
    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const currentPreference = readStoredPreference();

    setPreference(currentPreference);
    applyTheme(currentPreference, mediaQueryList.matches);

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
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

    if (nextPreference === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    }

    applyTheme(nextPreference, mediaQueryList.matches);
  }

  return (
    <div className="theme-control">
      <p className="theme-control-label">Theme</p>
      <div aria-label="Theme" className="theme-switcher" role="radiogroup">
        {themeOptions.map((option) => {
          const isActive = preference === option.value;

          return (
            <label className="theme-option" data-active={isActive} key={option.value}>
              <input
                checked={isActive}
                name="theme-preference"
                onChange={() => updatePreference(option.value)}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}