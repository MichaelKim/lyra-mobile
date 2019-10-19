// @flow strict

// A collection of utility functions that require built-in Node modules

import SHA256 from 'crypto-js/sha256';

export function createID(filepath: string) {
  return SHA256(filepath);
}

export function getFileName(filepath: string) {
  const slash = filepath.lastIndexOf('/');
  const dot = filepath.lastIndexOf('.');
  return filepath.substring(slash + 1, dot);
}
