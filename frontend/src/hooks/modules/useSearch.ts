import { useState, useEffect, useRef } from 'react';

/**
 * Hook for debounced search functionality
 *
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @param onDebouncedChange - Callback fired after delay ms of no changes
 * @returns Object containing searchValue, setSearchValue, and isSearching state
 *
 * @example
 * ```ts
 * const { searchValue, setSearchValue, isSearching } = useSearch('', 250, (query) => {
 *   fetchUsers(query);
 * });
 * ```
 */
export function useSearch(
  initialValue: string,
  delay: number,
  onDebouncedChange: (value: string) => void
) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onDebouncedChange);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    // Skip effect if value is still at initial value (haven't actually changed)
    if (searchValue === initialValue) {
      return;
    }

    // Set searching to true while waiting for debounce
    setIsSearching(true);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced change
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(searchValue);
      setIsSearching(false);
    }, delay);

    // Cleanup timeout on unmount or value change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, initialValue, delay]);

  return {
    searchValue,
    setSearchValue,
    isSearching,
  };
}
