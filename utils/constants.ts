// Shared constants for the application

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100" },
  { id: 2, name: "Vegetables", icon: "🥬", color: "bg-green-100" },
  { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100" },
  { id: 4, name: "Snacks", icon: "🍪", color: "bg-yellow-100" },
];

export const API_BASE = "http://10.0.2.2:5000/api";

