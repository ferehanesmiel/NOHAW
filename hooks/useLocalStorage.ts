
// FIX: Import React to make the React namespace available.
import * as React from 'react';

function getStorageValue<T,>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to parse localStorage value", e);
        return defaultValue;
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = React.useState(() => {
    return getStorageValue(key, defaultValue);
  });

  React.useEffect(() => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("Failed to set localStorage value", e);
    }
  }, [key, value]);

  return [value, setValue];
};
