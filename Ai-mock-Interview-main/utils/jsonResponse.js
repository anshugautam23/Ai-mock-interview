const stripCodeFence = (text) =>
  text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

const extractJsonPayload = (text) => {
  const cleaned = stripCodeFence(String(text || "").trim());
  const arrayStart = cleaned.indexOf("[");
  const objectStart = cleaned.indexOf("{");

  if (arrayStart === -1 && objectStart === -1) {
    throw new Error("No JSON found in AI response");
  }

  const useArray =
    arrayStart !== -1 && (objectStart === -1 || arrayStart < objectStart);
  const start = useArray ? arrayStart : objectStart;
  const end = useArray ? cleaned.lastIndexOf("]") : cleaned.lastIndexOf("}");

  if (end === -1 || end <= start) {
    throw new Error("Incomplete JSON found in AI response");
  }

  return cleaned.slice(start, end + 1);
};

const escapeControlCharactersInStrings = (jsonText) => {
  let output = "";
  let inString = false;
  let escaped = false;

  for (const char of jsonText) {
    if (escaped) {
      output += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      output += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      output += char;
      inString = !inString;
      continue;
    }

    if (inString) {
      if (char === "\n") {
        output += "\\n";
        continue;
      }

      if (char === "\r") {
        output += "\\r";
        continue;
      }

      if (char === "\t") {
        output += "\\t";
        continue;
      }

      if (char < " ") {
        output += `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
        continue;
      }
    }

    output += char;
  }

  return output;
};

export const parseJsonResponse = (text) => {
  const payload = extractJsonPayload(text);

  try {
    return JSON.parse(payload);
  } catch {
    return JSON.parse(escapeControlCharactersInStrings(payload));
  }
};

export const normalizeJsonResponse = (text) =>
  JSON.stringify(parseJsonResponse(text));
