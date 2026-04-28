import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function wordCount(text: string): number {
  if (!text) return 0;
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return cleaned ? cleaned.split(' ').length : 0;
}
export function estimateReadTime(text: string): string {
  const words = wordCount(text);
  const wpm = 180; // Average speaking speed for broadcasting
  const totalSeconds = Math.ceil((words / wpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}