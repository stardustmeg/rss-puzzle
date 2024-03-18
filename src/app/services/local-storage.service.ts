export const STORAGE_KEY = 'stardustmegw3mwXKWeQNzpLWVQGsMU7GMSnRjm9pG5';

export function saveCurrentStateToLocalStorage<S>(state: S): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalStorage(): void {
  localStorage.clear();
}
