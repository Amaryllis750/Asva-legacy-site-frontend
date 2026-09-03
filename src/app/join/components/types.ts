export type Step = 1 | 2 | 3;

export interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  reference_code?: string;
}

export type Tab =
  | "overview"
  | "documents"
  | "links"
  | "internships"
  | "certificates"
  | "teams"
  | "events";

  export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  status: "issued" | "pending";
};

export type Document = {
  id: number;
  title: string;
  category: string;
  date: string;
  size: string;
  type: string;
};

export type LinkItem = {
  id: number;
  title: string;
  url: string;
  category: string;
  date: string;
};

export type Internship = {
  id: number;
  title: string;
  company: string;
  type: string;
  deadline: string;
  location: string;
  tags: string[];
};
