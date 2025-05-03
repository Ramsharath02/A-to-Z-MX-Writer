export enum FormStep {
  NAME,
  EMAIL,
  CSV_UPLOAD,
  FINAL,
  SUCCESS
}

export interface FormData {
  name: string;
  email: string;
  website: string;
  csvName: string;
}