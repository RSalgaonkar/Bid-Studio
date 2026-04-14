const STORAGE_KEY = "bid-studio-state";

export const loadAppState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);

    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return undefined;
  }
};

export const saveAppState = (state) => {
  try {
    const appState = {
      clients: state.clients,
      bids: state.bids,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};

export const clearAppState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};