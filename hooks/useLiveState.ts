
import { useState, useEffect, useCallback } from 'react';

const useLiveState = <T,>(key: string, initialState: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialState;
    }
  });

  const setLiveState = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // Manually dispatch a storage event to ensure same-tab updates if needed, though react state handles this.
      // The primary purpose is for other tabs.
      window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore),
      }));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, state]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setState(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Error parsing storage event value', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [state, setLiveState];
};

export default useLiveState;
