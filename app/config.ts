import invariant from "tiny-invariant";

function validateVariable(variable: string | undefined, name: string): void {
  invariant(variable, `${name} is required in environment variable`);
}

validateVariable(process.env.SESSION_SECRET, "SESSION_SECRET");
validateVariable(process.env.API_URL, "API_URL");
validateVariable(process.env.COOKIE_MAX_AGE, "COOKIE_MAX_AGE");

const config = {
  environment: process.env.NODE_ENV,
  api: {
    baseUrl: process.env.API_URL || "API_URL",
    baseUrlDev: process.env.API_DEV_URL || "API_DEV_URL",
  },
  sessionSecret: process.env.SESSION_SECRET || "SESSION_SECRET",
  cookieMaxAge: process.env.COOKIE_MAX_AGE
    ? parseInt(process.env.COOKIE_MAX_AGE)
    : 86400,
};

export default config;
