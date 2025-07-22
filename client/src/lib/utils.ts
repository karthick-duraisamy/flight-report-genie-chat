
import { type ClassValue } from 'class-variance-authority';

export function cn(...inputs: ClassValue[]) {
  // Simple class name concatenation without Tailwind merge
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
