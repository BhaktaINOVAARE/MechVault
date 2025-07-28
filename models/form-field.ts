export interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  inputType?: string;
  validations?: Validation[];
}

export interface Validation {
  type: string;
  value?: any;
  message: string;
}