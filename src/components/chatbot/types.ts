
import { ReactElement } from "react";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface SchemeCategory {
  id: string;
  name: string;
  icon: ReactElement;
  schemes: Scheme[];
}

export interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
}

export interface StateScheme {
  name: string;
  description: string;
  benefits: string;
}
