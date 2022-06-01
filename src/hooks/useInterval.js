import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage intervals in react function components. @Credits - Dan Abramov
 * @param {function} callback - Callback function to be called at set intervals.
 * @param {number | null} delay - Intervals delay time or null to stop.
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
