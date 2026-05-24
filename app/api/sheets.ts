import { createSign } from "node:crypto";

type BetaSignupInput = {
  email: string;
  notes?: string;
  source?: string;
  status?: string;
  userAgent?: string;
};

type AppendBetaSignupResult = {
  duplicate: boolean;
  stored: boolean;
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function getGooglePrivateKey() {
  return process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replaceAll("\\n", "\n");
}

function hasSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
      getGooglePrivateKey() &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  );
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = getGooglePrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Sheets service account credentials.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  const payload = {
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
    iss: clientEmail,
    scope: GOOGLE_SHEETS_SCOPE
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = createSign("RSA-SHA256").update(unsignedToken).sign(privateKey);
  const assertion = `${unsignedToken}.${base64Url(signature)}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    body: new URLSearchParams({
      assertion,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer"
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Google auth failed: ${response.status} ${await response.text()}`);
  }

  const result = await response.json();
  return String(result.access_token);
}

async function fetchExistingBetaEmails({
  accessToken,
  sheetName,
  spreadsheetId
}: {
  accessToken: string;
  sheetName: string;
  spreadsheetId: string;
}) {
  const range = encodeURIComponent(`${sheetName}!B:B`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  });

  if (!response.ok) {
    throw new Error(`Google Sheets lookup failed: ${response.status} ${await response.text()}`);
  }

  const result = (await response.json()) as { values?: unknown[][] };
  const values = Array.isArray(result.values) ? result.values : [];

  return new Set(
    values
      .flat()
      .map((value) => String(value).trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function appendBetaSignup({
  email,
  notes = "",
  source = "Landing page",
  status = "New",
  userAgent = ""
}: BetaSignupInput): Promise<AppendBetaSignupResult> {
  if (!hasSheetsConfig()) {
    return { duplicate: false, stored: false };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_BETA_SHEET_NAME || "Beta Signups";
  const accessToken = await getGoogleAccessToken();
  const existingEmails = await fetchExistingBetaEmails({ accessToken, sheetName, spreadsheetId });

  if (existingEmails.has(email.trim().toLowerCase())) {
    return { duplicate: true, stored: false };
  }

  const range = encodeURIComponent(`${sheetName}!A:F`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    body: JSON.stringify({
      values: [[new Date().toISOString(), email, source, status, userAgent, notes]]
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Google Sheets append failed: ${response.status} ${await response.text()}`);
  }

  return { duplicate: false, stored: true };
}
