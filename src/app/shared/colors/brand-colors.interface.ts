export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export type BrandColorRole = 'none' | 'primary' | 'secondary' | 'accent';

export type BrandColorChangeEvent = { color: string, role: BrandColorRole };