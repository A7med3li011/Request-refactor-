import en from "./en.js";
import ar from "./ar.js";

const messages = { en, ar };

export default function getMessage(lang = "en", key) {
  return (
    messages[lang]?.[key] || messages["en"][key] || "internal server error"
  );
}
