import { ReactNode } from "react";

export interface Book {
  id: string;
  coverUrl: string;
  slug: string;
  title: string;
  description: ReactNode;
}

export interface Plan {
  weekly: { price: number; label: string };
  monthly: { price: number; label: string; save: string };
}
