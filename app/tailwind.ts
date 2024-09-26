import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
