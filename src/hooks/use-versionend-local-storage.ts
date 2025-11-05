import { useLocalStorage } from "@uidotdev/usehooks";

// Update this value when you want to reset the local storage
const VERSION = "v1.1-test";

type UseLocalStorageType = typeof useLocalStorage;

export const useVersionendLocalStorage: UseLocalStorageType = (
  key,
  initialValue
) => {
  const [value, setValue] = useLocalStorage(`${VERSION}-${key}`, initialValue);

  return [value, setValue];
};
