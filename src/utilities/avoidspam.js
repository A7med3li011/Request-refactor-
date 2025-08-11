export function avoidResendSpam(userExist) {
  const COOLDOWN_MINUTES = 1;
  const now = new Date();
  const lastSent = userExist.lastOtpSentAt || new Date(0);
  const diffMs = now - lastSent;
  const diffMinutes = diffMs / 1000 / 60;

  if (diffMinutes < COOLDOWN_MINUTES) {
    return true;
  } else {
    return false;
  }
}
