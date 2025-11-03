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
