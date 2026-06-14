import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
//* IMPORTING ENV TRIGGERS ZOD VALIDATION AT BUILD TIME — MISSING VARS FAIL THE BUILD IMMEDIATELY
import "./src/config/env.config";

//* RESOLVE APP ENVIRONMENT — NEXT_PUBLIC_APP_ENV (SET BY DOTENV-CLI) TAKES PRIORITY OVER NODE_ENV
const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development";
const isProd = appEnv === "production";

//* REMOTE PATTERNS — LOCAL DEVELOPER MACHINE (LOCALHOST)
const localPatterns = [
  { protocol: "http" as const, hostname: "localhost", port: "5001", pathname: "/uploads/**" },
];

//* REMOTE PATTERNS — OFFICE INTERNAL NETWORK SERVERS
const officePatterns = [
  { protocol: "http" as const, hostname: "192.168.100.242", port: "5001", pathname: "/uploads/**" },
  { protocol: "http" as const, hostname: "192.168.100.223", port: "5001", pathname: "/uploads/**" },
  { protocol: "http" as const, hostname: "192.168.0.221",   port: "5001", pathname: "/uploads/**" },
];

//* REMOTE PATTERNS — LIVE PRODUCTION CDN AND API DOMAIN ONLY
const productionPatterns = [
  { protocol: "https" as const, hostname: "api.thaihealth.com", pathname: "/uploads/**" },
];

function getRemotePatterns() {
  if (isProd) return productionPatterns;
  if (appEnv === "office") return [...localPatterns, ...officePatterns];
  return localPatterns;
}

const nextConfig: NextConfig = {
  images: {
    //* SKIP NEXT.JS IMAGE OPTIMIZER IN DEV — BROWSER LOADS DIRECTLY FROM PRIVATE IPS
    unoptimized: !isProd,
    dangerouslyAllowLocalIP: !isProd,
    qualities: [75, 90],
    remotePatterns: getRemotePatterns(),
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
