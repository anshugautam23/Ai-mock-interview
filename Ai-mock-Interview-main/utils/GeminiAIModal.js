const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Support multiple comma-separated keys via NEXT_PUBLIC_GEMINI_API_KEYS,
// falling back to the legacy single-key variable.
const rawKeys =
  process.env.NEXT_PUBLIC_GEMINI_API_KEYS ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "";

const apiKeys = rawKeys
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

if (apiKeys.length === 0) {
  console.warn(
    "[GeminiAIModal] No Gemini API keys found. Set NEXT_PUBLIC_GEMINI_API_KEYS (comma-separated) in .env.local"
  );
}

const clients = apiKeys.map((key) => new GoogleGenerativeAI(key));

const textModelFallbacks = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const isQuotaError = (error) => {
  const errorMsg = error?.message || "";
  return errorMsg.includes("429") || errorMsg.includes("quota");
};

const isBusyError = (error) => {
  const errorMsg = error?.message || "";
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("503") ||
    errorMsg.includes("high demand") ||
    errorMsg.includes("overloaded")
  );
};

const isUnsupportedModelError = (error) => {
  const errorMsg = error?.message || "";
  return errorMsg.includes("404") && errorMsg.includes("not found");
};

// Parse "retryDelay":"7s" hint from Gemini quota errors.
const parseRetryDelayMs = (error) => {
  const errorMsg = error?.message || "";
  const match = errorMsg.match(/"retryDelay"\s*:\s*"(\d+)(?:\.(\d+))?s"/);
  if (!match) return null;
  const seconds = parseInt(match[1], 10);
  return seconds * 1000;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getModel = (clientIndex, modelName) =>
  clients[clientIndex].getGenerativeModel({ model: modelName });

const startChatSession = (
  modelName = textModelFallbacks[0],
  clientIndex = 0
) =>
  getModel(clientIndex, modelName).startChat({
    generationConfig,
    safetySettings,
  });

// Try every (key x model) combination. On quota errors honor the retryDelay
// hint once, then move on to the next combination.
const runWithFallback = async (executor) => {
  if (clients.length === 0) {
    throw new Error(
      "No Gemini API keys configured. Set NEXT_PUBLIC_GEMINI_API_KEYS in .env.local"
    );
  }

  let lastError;
  let quotaHit = false;

  for (let keyIdx = 0; keyIdx < clients.length; keyIdx++) {
    for (const modelName of textModelFallbacks) {
      try {
        return await executor(keyIdx, modelName);
      } catch (error) {
        lastError = error;
        if (isQuotaError(error)) quotaHit = true;

        if (!isBusyError(error) && !isUnsupportedModelError(error)) {
          throw error;
        }
      }
    }
  }

  // If everything failed with quota errors, wait the suggested delay once
  // and retry the first key/model — gives the API time to reset.
  if (quotaHit) {
    const retryDelay = parseRetryDelayMs(lastError);
    if (retryDelay && retryDelay <= 15000) {
      await sleep(retryDelay + 500);
      try {
        return await executor(0, textModelFallbacks[0]);
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError;
};

export const sendMessageWithFallback = async (prompt) =>
  runWithFallback(async (keyIdx, modelName) => {
    const session = startChatSession(modelName, keyIdx);
    return session.sendMessage(prompt);
  });

export const generateContentWithFallback = async (parts) =>
  runWithFallback(async (keyIdx, modelName) => {
    const model = getModel(keyIdx, modelName);
    return model.generateContent(parts);
  });

export const chatSession =
  clients.length > 0 ? startChatSession() : null;

export const isGeminiBusyError = isBusyError;
export const isGeminiQuotaError = isQuotaError;
export const getGeminiRetryDelayMs = parseRetryDelayMs;

export const defaultTextModels = textModelFallbacks;

export const createChatSession = startChatSession;

export const configuredKeyCount = clients.length;
