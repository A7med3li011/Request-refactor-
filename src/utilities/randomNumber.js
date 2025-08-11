import { customAlphabet } from "nanoid";

export function randomNumber(length) {
  const nanoidNumbers = customAlphabet("0123456789", length);
  const code = nanoidNumbers();

  return code;
}
