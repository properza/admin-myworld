import { useMatches } from "@remix-run/react";
import { parseISO, format } from "date-fns";
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user !== null &&
    user !== undefined &&
    typeof user === "object" &&
    "username" in user &&
    "email" in user &&
    typeof user.username === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function constructURL(baseURL: string, endpoint: string): URL {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL : baseURL + "/";
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;
  return new URL(normalizedEndpoint, normalizedBaseURL);
}

const ThaiMonthMapping: Record<string, string> = {
  ["January"]: "ม.ค.",
  ["February"]: "ก.พ.",
  ["March"]: "มี.ค.",
  ["April"]: "เม.ย.",
  ["May"]: "พ.ค.",
  ["June"]: "มิ.ย.",
  ["July"]: "ก.ค.",
  ["August"]: "ส.ค.",
  ["September"]: "ก.ย.",
  ["October"]: "ต.ค.",
  ["November"]: "พ.ย.",
  ["December"]: "ธ.ค.",
};

export function getThaiTimestamp(timestamp: string): string {
  const parsedISO = parseISO(timestamp);

  const date = format(parsedISO, "dd");
  const month = ThaiMonthMapping[format(parsedISO, "MMMM")];
  const year = format(parsedISO, "yyyy");
  const time = format(parsedISO, "HH:mm");

  return `${date} ${month} ${year} ${time}`;
}

export const convertUTC = ({
  dateValue,
  isStart,
}: {
  dateValue: Date | string;
  isStart?: boolean;
}) => {
  const date = new Date(dateValue);
  const timeSuffix = isStart ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const utcDate = format(date, "yyyy-MM-dd") + timeSuffix;
  return utcDate;
};
