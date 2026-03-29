export function validateDisplayName(displayName: string): string | null {
  displayName = displayName.trim();
  if (!displayName) {
    return 'need a display name';
  }
  if (displayName.length < 6 || displayName.length > 64) {
    return 'display name has to be 6-64 characters';
  }
  if (!/^[A-Za-z0-9]+$/.test(displayName)) {
    return 'display name can only be letters and numbers';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  password = password.trim();
  if (!password) {
    return 'need a password';
  }
  if (password.length < 7 || password.length > 14) {
    return 'password has to be 7-14 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'password needs at least 1 uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'password needs at least 1 number';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'password needs at least 1 special character';
  }
  return null;
}
