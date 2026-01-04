import { LocationAssistantPayload } from "./locationTypes";

type FallbackEntry = {
  patterns: string[];
  payload: LocationAssistantPayload;
};

const FALLBACK_DIRECTORY: FallbackEntry[] = [
  {
    patterns: ["los angeles", "la, ca", "ladwp"],
    payload: {
      departmentName: "Los Angeles Department of Water and Power",
      billPaymentUrl: "https://www.ladwp.com/my-account",
      phoneNumber: "800-342-5397",
      departmentWebsiteUrl: "https://www.ladwp.com/",
      oversightDepartment: "Los Angeles Board of Water and Power Commissioners",
      oversightUrl: "https://www.ladwp.com/about-ladwp",
      grantsOrAidUrl: "https://www.ladwp.com/lidp",
      summaryLines: [
        "LADWP portal supports online billing and autopay.",
        "Call 800-342-5397 for payment plan setup.",
        "Assistance: LADWP Low Income Discount Program.",
      ],
    },
  },
  {
    patterns: ["new york", "nyc", "brooklyn", "manhattan"],
    payload: {
      departmentName: "New York City Department of Environmental Protection",
      billPaymentUrl: "https://www.nyc.gov/site/dep/pay-my-bill/pay-my-bill.page",
      phoneNumber: "718-595-7000",
      departmentWebsiteUrl: "https://www.nyc.gov/dep",
      oversightDepartment: "NYC Mayor's Office of Operations",
      oversightUrl: "https://www.nyc.gov/site/operations/index.page",
      grantsOrAidUrl: "https://www.nyc.gov/site/dep/pay-my-bill/water-debt-assistance.page",
      summaryLines: [
        "NYC DEP My DEP Account handles billing.",
        "Call 718-595-7000 for account support.",
        "Assistance: Water Debt Assistance Program details.",
      ],
    },
  },
  {
    patterns: ["chicago", "cook county"],
    payload: {
      departmentName: "Chicago Department of Finance - Utility Billing",
      billPaymentUrl: "https://www.chicago.gov/city/en/depts/fin/svcs/water-sewer.html",
      phoneNumber: "312-744-4420",
      departmentWebsiteUrl: "https://www.chicago.gov/city/en/depts/fin.html",
      oversightDepartment: "Chicago Office of Inspector General",
      oversightUrl: "https://igchicago.org/",
      grantsOrAidUrl: "https://www.chicago.gov/city/en/depts/fin/supp_info/utility-billing-relief.html",
      summaryLines: [
        "Chicago billing via Department of Finance portal.",
        "Call 312-744-4420 for payment plans.",
        "Assistance: Utility Billing Relief enrollment.",
      ],
    },
  },
  {
    patterns: ["austin", "travis county"],
    payload: {
      departmentName: "City of Austin Utilities",
      billPaymentUrl: "https://www.austintexas.gov/page/pay-utility-bill",
      phoneNumber: "512-494-9400",
      departmentWebsiteUrl: "https://www.austintexas.gov/department/austin-energy",
      oversightDepartment: "Austin City Council - Austin Energy Committee",
      oversightUrl: "https://www.austintexas.gov/department/city-council",
      grantsOrAidUrl: "https://www.austintexas.gov/department/cap",
      summaryLines: [
        "Austin Energy manages city utility billing online.",
        "Call 512-494-9400 for customer care.",
        "Assistance: Customer Assistance Program link.",
      ],
    },
  },
  {
    patterns: ["seattle", "king county"],
    payload: {
      departmentName: "Seattle Public Utilities",
      billPaymentUrl: "https://myutilities.seattle.gov/",
      phoneNumber: "206-684-3000",
      departmentWebsiteUrl: "https://www.seattle.gov/utilities",
      oversightDepartment: "Seattle City Council - Public Assets & Utilities",
      oversightUrl: "https://www.seattle.gov/council/committees",
      grantsOrAidUrl: "https://www.seattle.gov/utilities/services/bill-assistance",
      summaryLines: [
        "Seattle Public Utilities portal handles water bills.",
        "Call 206-684-3000 for utility service.",
        "Assistance: Emergency Utility Assistance Program.",
      ],
    },
  },
];

const DIRECTORY_TABLE_PREFERENCES = [
  "utility_directory",
  "utilities",
  "providers",
  "utility_providers",
  "domains",
  "utility_domains",
];

type DirectoryLookupEnv = {
  "domains-db"?: D1Database;
};

type DirectoryTableInfo = {
  name: string;
  columns: string[];
};

const NAME_COLUMNS = ["name", "utility", "provider", "department", "agency"];
const WEBSITE_COLUMNS = ["website", "url", "site", "homepage", "domain", "web"];
const PAYMENT_COLUMNS = [
  "payment_url",
  "billing_url",
  "bill_url",
  "pay_url",
  "payment",
  "billing",
];
const PHONE_COLUMNS = ["phone", "phone_number", "contact_phone", "customer_service"];
const OVERSIGHT_COLUMNS = ["oversight_department", "oversight", "regulator", "governing_body"];
const OVERSIGHT_URL_COLUMNS = ["oversight_url", "regulator_url", "governing_url"];
const ASSISTANCE_COLUMNS = [
  "assistance_url",
  "aid_url",
  "grants_url",
  "relief_url",
  "assistance",
];
const LOCATION_COLUMNS = [
  "city",
  "town",
  "state",
  "province",
  "county",
  "service_area",
  "servicearea",
  "service_area_name",
  "zip",
  "zipcode",
  "postal_code",
];

export function buildFallbackLocationPayload(
  location: string,
): LocationAssistantPayload {
  const normalized = normalizeLocation(location);
  const match = FALLBACK_DIRECTORY.find((entry) =>
    entry.patterns.some((pattern) => normalized.includes(pattern)),
  );

  if (match) {
    const payload = clonePayload(match.payload);
    const summaries = Array.isArray(payload.summaryLines)
      ? [...payload.summaryLines]
      : [];
    summaries.push("AI fallback: verify details with official sources.");
    return {
      ...payload,
      summaryLines: summaries.slice(0, 3),
    };
  }

  const titleCased = toTitleCase(normalized) || "Local";
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${titleCased} pay water bill`,
  )}`;

  return {
    departmentName: `${titleCased} Utilities Department (estimated)`,
    billPaymentUrl: searchUrl,
    departmentWebsiteUrl: null,
    phoneNumber: "800-426-4791",
    oversightDepartment:
      "U.S. Environmental Protection Agency - Safe Drinking Water Hotline",
    oversightUrl: "https://www.epa.gov/sdwa/safe-drinking-water-hotline",
    grantsOrAidUrl: "https://www.usa.gov/help-with-bills",
    summaryLines: [
      "AI fallback: contact your city utility first.",
      "Use the search link for bill portal.",
      "Safe Drinking Water Hotline answers compliance questions.",
    ],
  };
}

export async function lookupLiveLocationPayload(
  location: string,
  env: DirectoryLookupEnv,
): Promise<LocationAssistantPayload | null> {
  const db = env["domains-db"];
  if (!db) return null;
  const normalized = normalizeLocation(location);
  if (!normalized) return null;

  const tableInfo = await findDirectoryTable(db);
  if (!tableInfo) return null;

  const match = await findDirectoryMatch(db, tableInfo, normalized);
  if (!match) return null;

  const payload = mapDirectoryMatchToPayload(match, tableInfo.columns);
  if (!payload) return null;

  payload.summaryLines = summarizeLivePayload(payload);
  return payload;
}

function normalizeLocation(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9,&]/g, " ").replace(/\s+/g, " ").trim();
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function clonePayload(payload: LocationAssistantPayload): LocationAssistantPayload {
  return JSON.parse(JSON.stringify(payload)) as LocationAssistantPayload;
}

async function findDirectoryTable(db: D1Database): Promise<DirectoryTableInfo | null> {
  try {
    const tables = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all<{ name: string }>();
    const names = tables.results.map((row) => row.name);
    const preferred = DIRECTORY_TABLE_PREFERENCES.find((candidate) =>
      names.some((name) => name.toLowerCase() === candidate),
    );
    const selectedName =
      preferred ||
      names.find((name) => /utility|provider|domain/i.test(name)) ||
      names[0];

    if (!selectedName) return null;
    const columns = await fetchTableColumns(db, selectedName);
    if (columns.length === 0) return null;
    return { name: selectedName, columns };
  } catch (error) {
    console.warn("Utility directory lookup failed:", error);
    return null;
  }
}

async function fetchTableColumns(db: D1Database, tableName: string): Promise<string[]> {
  try {
    const result = await db
      .prepare(`PRAGMA table_info(${tableName})`)
      .all<{ name: string }>();
    return result.results.map((row) => row.name);
  } catch (error) {
    console.warn("Failed to inspect utility directory schema:", error);
    return [];
  }
}

async function findDirectoryMatch(
  db: D1Database,
  tableInfo: DirectoryTableInfo,
  normalized: string,
): Promise<Record<string, unknown> | null> {
  const searchableColumns = buildSearchableColumns(tableInfo.columns);
  if (searchableColumns.length === 0) return null;

  const likeValue = `%${normalized}%`;
  const predicates = searchableColumns.map((column) => `lower(${column}) LIKE ?`).join(" OR ");
  const statement = db
    .prepare(`SELECT * FROM ${tableInfo.name} WHERE ${predicates} LIMIT 1`)
    .bind(...searchableColumns.map(() => likeValue));

  try {
    const row = await statement.first<Record<string, unknown>>();
    return row || null;
  } catch (error) {
    console.warn("Utility directory search failed:", error);
    return null;
  }
}

function buildSearchableColumns(columns: string[]): string[] {
  const lowered = columns.map((column) => column.toLowerCase());
  const desired = new Set([...NAME_COLUMNS, ...LOCATION_COLUMNS]);
  const matches: string[] = [];
  lowered.forEach((name, index) => {
    if (desired.has(name)) {
      matches.push(columns[index]);
    }
  });
  return matches;
}

function mapDirectoryMatchToPayload(
  row: Record<string, unknown>,
  columns: string[],
): LocationAssistantPayload | null {
  const nameColumn = findColumn(columns, NAME_COLUMNS);
  const websiteColumn = findColumn(columns, WEBSITE_COLUMNS);
  const paymentColumn = findColumn(columns, PAYMENT_COLUMNS);
  const phoneColumn = findColumn(columns, PHONE_COLUMNS);
  const oversightColumn = findColumn(columns, OVERSIGHT_COLUMNS);
  const oversightUrlColumn = findColumn(columns, OVERSIGHT_URL_COLUMNS);
  const assistanceColumn = findColumn(columns, ASSISTANCE_COLUMNS);

  const departmentName = coerceString(row[nameColumn ?? ""]);
  const departmentWebsiteUrl = normalizeUrlValue(coerceString(row[websiteColumn ?? ""]));
  const billPaymentUrl = normalizeUrlValue(coerceString(row[paymentColumn ?? ""])) || departmentWebsiteUrl;
  const phoneNumber = coerceString(row[phoneColumn ?? ""]);
  const oversightDepartment = coerceString(row[oversightColumn ?? ""]);
  const oversightUrl = normalizeUrlValue(coerceString(row[oversightUrlColumn ?? ""]));
  const grantsOrAidUrl = normalizeUrlValue(coerceString(row[assistanceColumn ?? ""]));

  if (!departmentName && !departmentWebsiteUrl && !billPaymentUrl && !phoneNumber) {
    return null;
  }

  return {
    departmentName: departmentName || null,
    billPaymentUrl: billPaymentUrl || null,
    phoneNumber: phoneNumber || null,
    departmentWebsiteUrl: departmentWebsiteUrl || null,
    oversightDepartment: oversightDepartment || null,
    oversightUrl: oversightUrl || null,
    grantsOrAidUrl: grantsOrAidUrl || null,
  } satisfies LocationAssistantPayload;
}

function findColumn(columns: string[], aliases: string[]): string | null {
  const lowered = columns.map((column) => column.toLowerCase());
  for (const alias of aliases) {
    const index = lowered.indexOf(alias);
    if (index >= 0) return columns[index];
  }
  return null;
}

function coerceString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return `${value}`;
  return "";
}

function normalizeUrlValue(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function summarizeLivePayload(payload: LocationAssistantPayload): string[] {
  const summaries: string[] = [
    "Matched from a live utility directory.",
    payload.billPaymentUrl
      ? "Use the official payment portal above."
      : "Visit the official utility site for billing.",
    payload.phoneNumber
      ? "Call customer service for account help."
      : "Confirm phone details on the utility site.",
  ];
  return summaries.slice(0, 3);
}
