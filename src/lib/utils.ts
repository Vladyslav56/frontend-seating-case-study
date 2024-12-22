import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const BASE_URL =
	"https://nfctron-frontend-seating-case-study-2024.vercel.app"
