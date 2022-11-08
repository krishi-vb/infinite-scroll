export interface ColorsResponse {
  data?: ColorDetail[];
}

export interface ColorDetail {
  color: string;
  id: number;
  name: string;
  pantone_value: string;
  year: number;
}
