// A collection of utility functions that require built-in Node modules

import crypto from 'crypto-js';

export function createID(filepath: string): string {
  return crypto.SHA256(filepath).toString(crypto.enc.Hex);
}

export function getFileName(filepath: string) {
  const slash = filepath.lastIndexOf('/');
  const dot = filepath.lastIndexOf('.');
  return filepath.substring(slash + 1, dot);
}
