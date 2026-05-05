export function readStorageArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function writeStorageArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
