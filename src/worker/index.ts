import { Hono } from "hono";

const SHOWER_FLOW_RATE = 2.5;
const SINK_FLOW_RATE = 1.5;
const COST_PER_GALLON_MIN = 0.0058;
const COST_PER_GALLON_MAX = 0.009;

const subtle = (() => {
  if (typeof crypto.subtle !== "undefined") {
    return crypto.subtle;
  }
  const maybeWebCrypto = (crypto as unknown as { webcrypto?: Crypto }).webcrypto;
  if (maybeWebCrypto?.subtle) {
    return maybeWebCrypto.subtle;
  }
  throw new Error("Web Crypto subtle API is not available in this environment.");
})();

type WorkerEnv = {
  OPEN_API_KEY_NEW: string;
  OPENAI_ORG_ID: string;
  Google_Document_AI_Processor_Prediction_Endpoint: string;
  "Google-Service-Account-FINAL": string;
  "domains-db": D1Database;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: unknown;
};

type DocumentAIResponse = {
  document?: {
    text?: string;
  };
  error?: {
    message?: string;
  };
};

const app = new Hono<{ Bindings: WorkerEnv }>();

app.use("/api/*", async (c, next) => {
  validateEnv(c.env);
  await next();
});

app.get("/ads.txt", (c) =>
  c.text("google.com, pub-1860356577073395, DIRECT, f08c47fec0942fa0"),
);

app.post("/api/location", async (c) => {
  try {
    const { location } = await c.req.json<{ location?: string }>();
    if (!location || !location.trim()) {
      return c.json(
        { error: "Missing or invalid 'location' field." },
        400,
      );
    }

    const prompt = `As a personal assistant, provide a concise (50 words max) summary about the local water/sewage provider for "${location}" using minimal markdown (no code blocks).
1) Mention the authority name and present it as a working link labeled for downloading their water bill.
2) Mention a phone number for the water authority.
3) Provide important context before they view their bill like typical residential cost and if certain, provide a link to info about grants and elected officials with oversight over the water utility rates.
Each sentance, no more than nine words, should be a seperate line.`;

    const openAiData = await analyzeTextWithOpenAI(c.env, {
      content: prompt,
      includeWaterContext: false,
    });

    let content =
      openAiData.choices?.[0]?.message?.content || "No info found.";

    content = content
      .replace(/\n/g, "<br>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/```+/g, "")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

    return c.html(content);
  } catch (error) {
    console.error("Error in handleLocationQuery:", error);
    return c.json(
      { error: "Failed to retrieve location-based info." },
      500,
    );
  }
});

app.post("/api/upload", async (c) => {
  try {
    const contentType = c.req.header("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json(
        {
          error: "Invalid Content-Type. Must be multipart/form-data.",
        },
        400,
      );
    }

    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !validateFile(file)) {
      return c.json(
        { error: "Invalid file. Must be a non-empty PDF <10MB." },
        400,
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const hash = await generateHash(arrayBuffer);
    console.log("Generated PDF Hash:", hash);

    const token = await getOAuthToken(c.env);
    const endpoint =
      c.env.Google_Document_AI_Processor_Prediction_Endpoint;
    const visionResult = await callVisionAPI(arrayBuffer, token, endpoint);

    if (visionResult?.error) {
      console.error("Vision API Error:", visionResult.error);
      return c.json(
        {
          error:
            visionResult.error.message ||
            "Vision API OCR failed. Please try another file.",
        },
        500,
      );
    }

    const rawText = visionResult.document?.text;
    if (!rawText) {
      return c.json(
        { error: "No text extracted from PDF or invalid format." },
        400,
      );
    }

    const cleanText = preprocessText(rawText);
    const openAiData = await analyzeTextWithOpenAI(c.env, {
      content: cleanText,
      includeWaterContext: true,
    });

    return c.html(renderAnalysisResponse(openAiData));
  } catch (error) {
    console.error("Error handling file upload:", error);
    return c.json(
      { error: "An error occurred during file upload." },
      500,
    );
  }
});

app.get("/api/usage-defaults", (c) =>
  c.json({
    showerFlowRate: SHOWER_FLOW_RATE,
    sinkFlowRate: SINK_FLOW_RATE,
    costPerGallonMin: COST_PER_GALLON_MIN,
    costPerGallonMax: COST_PER_GALLON_MAX,
  }),
);

app.get("/api/", (c) => c.json({ name: "WaterShortcut" }));

export default app;

async function generateHash(buffer: ArrayBuffer): Promise<string> {
  const key = await subtle.importKey(
    "raw",
    new TextEncoder().encode("key"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await subtle.sign("HMAC", key, buffer);
  return arrayBufferToBase64(signature);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const sanitized = base64.trim().replace(/[^A-Za-z0-9+/=]/g, "");
  if (
    sanitized.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(sanitized)
  ) {
    throw new Error("Invalid base64 string.");
  }
  const binaryString = atob(sanitized);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer);
  let binary = "";
  arr.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function preprocessText(txt: unknown): string {
  if (typeof txt !== "string" || !txt.trim()) {
    console.error("Preprocessing failed. Invalid text:", txt);
    return "";
  }
  return txt.replace(/[^\x20-\x7E]+/g, " ").replace(/\s+/g, " ").trim();
}

async function getOAuthToken(env: WorkerEnv): Promise<string> {
  const tokenUri = "https://oauth2.googleapis.com/token";
  const creds = JSON.parse(env["Google-Service-Account-FINAL"]);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: tokenUri,
    exp: now + 3600,
    iat: now,
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedClaim = btoa(JSON.stringify(claim));

  let privateKey: string = creds.private_key.trim();
  if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}`;
  }
  if (!privateKey.endsWith("-----END PRIVATE KEY-----")) {
    privateKey = `${privateKey}\n-----END PRIVATE KEY-----`;
  }

  try {
    const keyData = privateKey.replace(/-----[^-]+-----|\n/g, "");
    const keyBytes = base64ToArrayBuffer(keyData);
    const key = await subtle.importKey(
      "pkcs8",
      keyBytes,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const toSign = `${encodedHeader}.${encodedClaim}`;
    const toSignBuf = new TextEncoder().encode(toSign);
    const sigBuf = await subtle.sign("RSASSA-PKCS1-v1_5", key, toSignBuf);
    const signature = arrayBufferToBase64(sigBuf);
    const jwt = `${encodedHeader}.${encodedClaim}.${signature}`;

    const response = await fetch(tokenUri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }).toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Failed to fetch OAuth token:", err);
      throw new Error("Failed to fetch OAuth token");
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      throw new Error("No access token returned by OAuth");
    }
    return data.access_token;
  } catch (error) {
    console.error("Error during OAuth token generation:", error);
    throw error;
  }
}

async function callVisionAPI(
  buffer: ArrayBuffer,
  token: string,
  endpoint: string,
): Promise<DocumentAIResponse> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rawDocument: {
          content: arrayBufferToBase64(buffer),
          mimeType: "application/pdf",
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Vision API call failed: ${res.statusText}`);
    }
    const json = (await res.json()) as DocumentAIResponse;
    if (!json || !json.document || !json.document.text) {
      throw new Error("Invalid Vision API response.");
    }
    return json;
  } catch (error) {
    console.error("Error in callVisionAPI:", error);
    throw error;
  }
}

async function analyzeTextWithOpenAI(
  env: WorkerEnv,
  options: { content: string; includeWaterContext?: boolean },
): Promise<ChatCompletionResponse> {
  const { content, includeWaterContext = true } = options;

  const prompt = includeWaterContext
    ? `You are a world-leading expert in water conservation and efficiency.\nProvide a concise set of location-based or usage-based recommendations.\n\nHere is the user content:\n${content}`
    : content;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPEN_API_KEY_NEW}`,
      "OpenAI-Organization": env.OPENAI_ORG_ID,
    },
    body: JSON.stringify({
      model: "o1-mini",
      max_completion_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = (await response.json()) as ChatCompletionResponse;

  if (!response.ok) {
    console.error(
      "OpenAI API request failed:",
      JSON.stringify(data, null, 2),
    );
    throw new Error("Failed to analyze text with OpenAI");
  }

  return data;
}

function renderAnalysisResponse(data: ChatCompletionResponse): string {
  const content =
    data.choices?.[0]?.message?.content || "No recommendations provided.";
  const formatted = content
    .replace(/\*\*\*(.*?)\*\*\*/g, "<h2>$1</h2>")
    .replace(/\n/g, "<br>");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;">
      <h1>Water Efficiency Recommendations</h1>
      ${formatted}
    </div>
  `;
}

function validateFile(file: File): boolean {
  if (
    !file ||
    !file.type.toLowerCase().includes("pdf") ||
    file.size === 0 ||
    file.size > 10 * 1024 * 1024
  ) {
    console.error("File validation failed (not a PDF or >10MB).");
    return false;
  }
  return true;
}

function validateEnv(env: WorkerEnv): void {
  [
    "OPEN_API_KEY_NEW",
    "OPENAI_ORG_ID",
    "Google_Document_AI_Processor_Prediction_Endpoint",
    "Google-Service-Account-FINAL",
  ].forEach((key) => {
    if (!env[key as keyof WorkerEnv]) {
      throw new Error(`Missing env var: ${key}`);
    }
  });
}
